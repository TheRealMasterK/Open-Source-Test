/**
 * Trade Detail Screen
 * View trade details with chat functionality
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/config/theme';
import { useTheme } from '@/hooks/common/useTheme';
import { useTrade, useTradeMessages, useSendMessage, useUpdateTradeStatus } from '@/hooks/api';
import { useSocket } from '@/hooks/common/useSocket';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CryptoIcon } from '@/components/ui/CryptoIcon';
import { useAppSelector } from '@/store';
import { TradeMessage, TradeStatus } from '@/types';

const getStatusVariant = (status: TradeStatus) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'cancelled':
    case 'disputed':
      return 'danger';
    case 'pending':
      return 'warning';
    case 'active':
      return 'info';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: TradeStatus): string => {
  const labels: Record<TradeStatus, string> = {
    pending: 'Pending',
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled',
    disputed: 'Disputed',
  };
  return labels[status] || status;
};

export default function TradeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const flatListRef = useRef<FlatList>(null);

  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');

  // Fetch trade data
  const { data: trade, isLoading, error } = useTrade(id || '');
  const { data: messages = [], refetch: refetchMessages } = useTradeMessages(id || '');
  const sendMessage = useSendMessage();
  const updateStatus = useUpdateTradeStatus();

  // Socket for real-time updates
  const { joinTradeRoom, leaveTradeRoom } = useSocket();

  useEffect(() => {
    if (id) {
      console.log('[TradeDetailScreen] Joining trade room:', id);
      joinTradeRoom(id);
      return () => leaveTradeRoom(id);
    }
  }, [id, joinTradeRoom, leaveTradeRoom]);

  console.log('[TradeDetailScreen] Rendering for trade:', id);

  const formatAmount = (amount: number, currency: string): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !id) return;

    try {
      console.log('[TradeDetailScreen] Sending message...');
      await sendMessage.mutateAsync({
        tradeId: id,
        payload: { content: message.trim() },
      });
      setMessage('');
      refetchMessages();

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      console.error('[TradeDetailScreen] Error sending message:', err);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleUpdateStatus = async (newStatus: TradeStatus) => {
    if (!id) return;

    const confirmMessage =
      newStatus === 'completed'
        ? 'Are you sure you want to mark this trade as completed?'
        : newStatus === 'cancelled'
        ? 'Are you sure you want to cancel this trade?'
        : 'Are you sure you want to update this trade?';

    Alert.alert('Confirm', confirmMessage, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          try {
            console.log('[TradeDetailScreen] Updating status to:', newStatus);
            await updateStatus.mutateAsync({ tradeId: id, status: newStatus });
            Alert.alert('Success', 'Trade status updated');
          } catch (err) {
            console.error('[TradeDetailScreen] Error updating status:', err);
            Alert.alert('Error', 'Failed to update trade status');
          }
        },
      },
    ]);
  };

  const handleDispute = () => {
    Alert.alert(
      'Open Dispute',
      'Are you sure you want to open a dispute for this trade? A moderator will review the case.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Dispute',
          style: 'destructive',
          onPress: () => handleUpdateStatus('disputed'),
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading trade..." />;
  }

  if (error || !trade) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Trade Details" showBack />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.danger.DEFAULT} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            Failed to load trade
          </Text>
          <Button title="Go Back" onPress={() => router.back()} variant="outline" />
        </View>
      </View>
    );
  }

  const isBuyer = user?.id === trade.buyerId;
  const counterpartyName = isBuyer ? trade.sellerDisplayName : trade.buyerDisplayName;
  const isActive = trade.status === 'active' || trade.status === 'pending';

  const renderMessage = ({ item }: { item: TradeMessage }) => {
    const isOwnMessage = item.senderId === user?.id;
    const isSystem = item.isSystem;

    if (isSystem) {
      return (
        <View style={styles.systemMessage}>
          <Text style={[styles.systemMessageText, { color: colors.textSecondary }]}>
            {item.content}
          </Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageBubble,
          isOwnMessage ? styles.ownMessage : styles.otherMessage,
          {
            backgroundColor: isOwnMessage
              ? Colors.primary.DEFAULT
              : isDark
              ? colors.surface
              : colors.surfaceSecondary,
          },
        ]}
      >
        {!isOwnMessage && (
          <Text style={[styles.messageSender, { color: colors.textSecondary }]}>
            {item.senderName}
          </Text>
        )}
        <Text
          style={[
            styles.messageText,
            { color: isOwnMessage ? Colors.white : colors.text },
          ]}
        >
          {item.content}
        </Text>
        <Text
          style={[
            styles.messageTime,
            { color: isOwnMessage ? 'rgba(255,255,255,0.7)' : colors.textTertiary },
          ]}
        >
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title={`Trade #${trade.tradeId?.slice(0, 8) || id?.slice(0, 8)}`}
        showBack
        rightComponent={
          <Badge
            text={getStatusLabel(trade.status)}
            variant={getStatusVariant(trade.status)}
          />
        }
      />

      {/* Tabs */}
      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'details' && styles.activeTab,
            activeTab === 'details' && { borderBottomColor: Colors.primary.DEFAULT },
          ]}
          onPress={() => setActiveTab('details')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'details' ? Colors.primary.DEFAULT : colors.textSecondary },
            ]}
          >
            Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'chat' && styles.activeTab,
            activeTab === 'chat' && { borderBottomColor: Colors.primary.DEFAULT },
          ]}
          onPress={() => setActiveTab('chat')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'chat' ? Colors.primary.DEFAULT : colors.textSecondary },
            ]}
          >
            Chat
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'details' ? (
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        >
          {/* Trade Summary Card */}
          <Card variant="outlined" style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View style={styles.cryptoInfo}>
                <CryptoIcon currency={trade.cryptoType} size="lg" />
                <View style={styles.cryptoDetails}>
                  <Text style={[styles.cryptoAmount, { color: colors.text }]}>
                    {trade.cryptoAmount.toFixed(6)} {trade.cryptoType}
                  </Text>
                  <Text style={[styles.fiatAmount, { color: colors.textSecondary }]}>
                    {formatAmount(trade.fiatAmount, trade.fiatCurrency)}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.directionBadge,
                  { backgroundColor: isBuyer ? Colors.success.DEFAULT + '20' : Colors.danger.DEFAULT + '20' },
                ]}
              >
                <Ionicons
                  name={isBuyer ? 'arrow-down' : 'arrow-up'}
                  size={16}
                  color={isBuyer ? Colors.success.DEFAULT : Colors.danger.DEFAULT}
                />
                <Text
                  style={[
                    styles.directionText,
                    { color: isBuyer ? Colors.success.DEFAULT : Colors.danger.DEFAULT },
                  ]}
                >
                  {isBuyer ? 'Buying' : 'Selling'}
                </Text>
              </View>
            </View>
          </Card>

          {/* Counterparty Info */}
          <Card variant="outlined" style={styles.partyCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Trading with
            </Text>
            <View style={styles.partyInfo}>
              <Avatar name={counterpartyName || 'User'} size="md" />
              <View style={styles.partyDetails}>
                <Text style={[styles.partyName, { color: colors.text }]}>
                  {counterpartyName || 'Anonymous'}
                </Text>
              </View>
            </View>
          </Card>

          {/* Payment Method */}
          <Card variant="outlined" style={styles.paymentCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Payment Method
            </Text>
            <View style={[styles.paymentBadge, { backgroundColor: colors.surfaceSecondary }]}>
              <Ionicons name="card-outline" size={20} color={colors.text} />
              <Text style={[styles.paymentText, { color: colors.text }]}>
                {trade.paymentMethod || 'Not specified'}
              </Text>
            </View>
          </Card>

          {/* Action Buttons */}
          {isActive && (
            <View style={styles.actions}>
              {isBuyer && trade.status === 'pending' && (
                <Button
                  title="I've Sent Payment"
                  onPress={() => handleUpdateStatus('active')}
                  loading={updateStatus.isPending}
                  fullWidth
                />
              )}
              {!isBuyer && trade.status === 'active' && (
                <Button
                  title="Release Crypto"
                  onPress={() => handleUpdateStatus('completed')}
                  loading={updateStatus.isPending}
                  fullWidth
                />
              )}
              <Button
                title="Cancel Trade"
                onPress={() => handleUpdateStatus('cancelled')}
                variant="outline"
                loading={updateStatus.isPending}
                fullWidth
                style={{ marginTop: Spacing.sm }}
              />
              <Button
                title="Open Dispute"
                onPress={handleDispute}
                variant="ghost"
                fullWidth
                style={{ marginTop: Spacing.sm }}
                textStyle={{ color: Colors.danger.DEFAULT }}
              />
            </View>
          )}
        </ScrollView>
      ) : (
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          />

          {/* Message Input */}
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.surface,
                borderTopColor: colors.border,
                paddingBottom: insets.bottom + Spacing.sm,
              },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceSecondary,
                  color: colors.text,
                },
              ]}
              placeholder="Type a message..."
              placeholderTextColor={colors.textTertiary}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: Colors.primary.DEFAULT },
                (!message.trim() || sendMessage.isPending) && { opacity: 0.5 },
              ]}
              onPress={handleSendMessage}
              disabled={!message.trim() || sendMessage.isPending}
            >
              <Ionicons name="send" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  errorText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  summaryCard: {
    marginBottom: Spacing.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cryptoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cryptoDetails: {
    marginLeft: Spacing.md,
  },
  cryptoAmount: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  fiatAmount: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  directionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  directionText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginLeft: 4,
  },
  partyCard: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  partyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partyDetails: {
    marginLeft: Spacing.md,
  },
  partyName: {
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  paymentCard: {
    marginBottom: Spacing.md,
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  paymentText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    marginLeft: Spacing.sm,
  },
  actions: {
    marginTop: Spacing.md,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageSender: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: FontSize.xs - 2,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  systemMessage: {
    alignSelf: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  systemMessageText: {
    fontSize: FontSize.xs,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.md,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    fontSize: FontSize.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

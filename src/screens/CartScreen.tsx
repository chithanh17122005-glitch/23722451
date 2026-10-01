import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Watermark } from '@components/Watermark';
import { useCartStore } from '@stores/cartStore';
import { useCampusLocation } from '@hooks/useCampusLocation';
import { ROOM_LABEL, PRICE_MULTIPLIER } from '@constants/student';
import { COLORS } from '@constants/theme';

export const CartScreen = () => {
  const { items, updateQuantity, removeFromCart, getTotalAmount } = useCartStore();
  const { shipFee } = useCampusLocation();

  const totalProductAmount = getTotalAmount();
  const grandTotal = totalProductAmount + shipFee;

  return (
    <SafeAreaView style={styles.container}>
      <Watermark />
      <View style={styles.header}>
        <Text style={styles.title}>GIỎ HÀNG</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id.toString()}
        renderItem={({ item }) => {
          const itemPrice = Math.round(item.product.price * PRICE_MULTIPLIER);
          return (
            <View style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.product.title}
                </Text>
                <Text style={styles.itemPrice}>
                  ×{item.quantity}  {(itemPrice * item.quantity).toLocaleString('vi-VN')} đ
                </Text>
              </View>
              <View style={styles.qtyContainer}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                >
                  <Text style={styles.qtyText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                >
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        contentContainerStyle={{ padding: 12 }}
      />

      <View style={styles.summaryBox}>
        <Text style={styles.roomLabel}>Giao đến {ROOM_LABEL}</Text>
        <Text style={styles.shipText}>
          Phí ship: {shipFee.toLocaleString('vi-VN')} đ (công thức B)
        </Text>
        <Text style={styles.totalText}>
          Tổng hàng: {grandTotal.toLocaleString('vi-VN')} đ
        </Text>
      </View>
      <Watermark />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 14, backgroundColor: COLORS.primary, alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  itemRow: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  itemPrice: { fontSize: 13, color: COLORS.textLight, marginTop: 4 },
  qtyContainer: { flexDirection: 'row', gap: 6 },
  qtyBtn: { backgroundColor: COLORS.secondary, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  qtyText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  summaryBox: { padding: 16, backgroundColor: COLORS.surface, borderTopWidth: 1, borderColor: COLORS.border },
  roomLabel: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  shipText: { fontSize: 13, color: COLORS.secondary, marginTop: 4 },
  totalText: { fontSize: 16, fontWeight: '900', color: COLORS.primary, marginTop: 8 },
});

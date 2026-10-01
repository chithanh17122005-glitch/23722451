import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Product } from '@services/productApi';
import { PRICE_MULTIPLIER, STUDENT } from '@constants/student';
import { COLORS } from '@constants/theme';
import { useCartStore } from '@stores/cartStore';

interface ProductCardProps {
  item: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, onPress }) => {
  const addToCart = useCartStore((s) => s.addToCart);

  const handleAdd = () => {
    addToCart(item);
    Haptics.selectionAsync();
  };

  const formattedPrice = Math.round(item.price * PRICE_MULTIPLIER).toLocaleString('vi-VN') + ' đ';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      key={`${STUDENT.mssv}-${item.id}`}
    >
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.price}>{formattedPrice}</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    margin: 6,
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: 110,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    height: 36,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});

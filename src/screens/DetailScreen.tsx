import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useQuery } from '@tanstack/react-query';
import { Watermark } from '@components/Watermark';
import { getProducts } from '@services/productApi';
import { PRICE_MULTIPLIER, STUDENT } from '@constants/student';
import { COLORS } from '@constants/theme';
import { useCartStore } from '@stores/cartStore';

export const DetailScreen = ({ route }: any) => {
  const { id } = route.params || {};
  const addToCart = useCartStore((s) => s.addToCart);

  const { data } = useQuery({ queryKey: ['products'], queryFn: getProducts });
  const product = (data || []).find((p) => p.id === id);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      Haptics.selectionAsync();
      Alert.alert('Thành công', `Đã thêm vào giỏ! MSSV: ${STUDENT.mssv}`);
    }
  };

  if (!product) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Watermark />
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>
          {Math.round(product.price * PRICE_MULTIPLIER).toLocaleString('vi-VN')} đ
        </Text>
        <Text style={styles.subText}>Giao nội khu · nhận tận phòng</Text>
        <Text style={styles.desc}>{product.description}</Text>

        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addText}>Thêm vào giỏ · Haptic</Text>
        </TouchableOpacity>
      </ScrollView>
      <Watermark />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, alignItems: 'center' },
  image: { width: '100%', height: 220, borderRadius: 12, backgroundColor: COLORS.surface, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  price: { fontSize: 20, fontWeight: '900', color: COLORS.primary, marginTop: 8 },
  subText: { fontSize: 12, color: COLORS.textLight, marginTop: 4 },
  desc: { fontSize: 13, color: COLORS.textLight, marginTop: 16, lineHeight: 18, textAlign: 'center' },
  addButton: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  addText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});

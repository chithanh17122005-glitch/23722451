import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { Watermark } from '@components/Watermark';
import { ProductCard } from '@components/ProductCard';
import { getProducts, Product } from '@services/productApi';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import { ROOM_LABEL, STALE_TIME_MS, STUDENT } from '@constants/student';
import { COLORS } from '@constants/theme';
import { useNavigation } from '@react-navigation/native';

const FlashListComp = FlashList as any;

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: STALE_TIME_MS,
  });

  const filteredData = (data || []).filter((p) =>
    p.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Watermark />
      <View style={styles.header}>
        <Text style={styles.appName}>KTXGO</Text>
        <Text style={styles.roomText}>Giao tận {ROOM_LABEL}</Text>

        <TextInput
          style={styles.searchInput}
          placeholder={`Tìm món (debounce) — ${STUDENT.mssv}`}
          value={search}
          onChangeText={setSearch}
        />
        <Text style={styles.flashListBadge}>(C) FlashList ×2</Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải món...</Text>
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{STUDENT.mssv}</Text>
          <Text style={styles.errorSub}>Không tải được dữ liệu món.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlashListComp
          data={filteredData}
          numColumns={2}
          estimatedItemSize={200}
          keyExtractor={(item: Product) => `${STUDENT.mssv}-${item.id}`}
          renderItem={({ item }: { item: Product }) => (
            <ProductCard item={item} onPress={() => navigation.navigate('Detail', { id: item.id })} />
          )}
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={{ padding: 6 }}
        />
      )}
      <Watermark />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 14, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderColor: COLORS.border },
  appName: { fontSize: 22, fontWeight: '900', color: COLORS.primary },
  roomText: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  searchInput: {
    height: 40,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 13,
  },
  flashListBadge: { fontSize: 11, color: COLORS.primary, textAlign: 'right', marginTop: 4, fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  loadingText: { marginTop: 12, color: COLORS.textLight, fontSize: 14 },
  errorText: { fontSize: 16, fontWeight: '700', color: COLORS.error },
  errorSub: { fontSize: 14, color: COLORS.textLight, marginTop: 4 },
  retryButton: { marginTop: 16, backgroundColor: COLORS.error, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: '#FFF', fontWeight: '700' },
});
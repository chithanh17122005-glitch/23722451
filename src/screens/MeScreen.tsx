import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Watermark } from '@components/Watermark';
import { STUDENT, examStamp } from '@constants/student';
import { COLORS } from '@constants/theme';
import { useCampusLocation } from '@hooks/useCampusLocation';
import { useAuthStore } from '@stores/authStore';

export const MeScreen = () => {
  const { status, distanceKm, requestLocation, openSettings, shipFee } = useCampusLocation();
  const logout = useAuthStore((s) => s.logout);

  return (
    <SafeAreaView style={styles.container}>
      <Watermark />
      <View style={styles.header}>
        <Text style={styles.title}>TÔI · LOCATION</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.name}>{STUDENT.hoTen}</Text>
          <Text style={styles.info}>
            {STUDENT.mssv}  ·  #{examStamp()}
          </Text>

          <View style={styles.statusBox}>
            <Text style={[styles.statusText, status === 'granted' ? styles.granted : styles.denied]}>
              Quyền: {status}
            </Text>
            {distanceKm !== null && (
              <Text style={styles.distText}>
                ≈ {distanceKm.toFixed(1)} km tới cổng KTX
              </Text>
            )}
            <Text style={styles.feeText}>
              Phí ship ước tính: {shipFee.toLocaleString('vi-VN')} đ
            </Text>
          </View>

          <TouchableOpacity style={styles.actionBtn} onPress={requestLocation}>
            <Text style={styles.btnText}>Lấy vị trí ước tính ship</Text>
          </TouchableOpacity>

          {status === 'blocked' && (
            <TouchableOpacity style={[styles.actionBtn, styles.outlineBtn]} onPress={openSettings}>
              <Text style={styles.outlineText}>Mở Cài đặt (blocked)</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.actionBtn, styles.logoutBtn]} onPress={logout}>
            <Text style={styles.btnText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Watermark />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 14, backgroundColor: COLORS.primary, alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  content: { padding: 16, flex: 1 },
  card: { backgroundColor: COLORS.surface, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  name: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  info: { fontSize: 13, color: COLORS.textLight, marginTop: 4 },
  statusBox: { width: '100%', marginTop: 20, padding: 12, backgroundColor: COLORS.background, borderRadius: 8 },
  statusText: { fontSize: 14, fontWeight: '700' },
  granted: { color: COLORS.success },
  denied: { color: COLORS.error },
  distText: { fontSize: 13, color: COLORS.text, marginTop: 4 },
  feeText: { fontSize: 14, fontWeight: '700', color: COLORS.secondary, marginTop: 6 },
  actionBtn: { width: '100%', height: 44, backgroundColor: COLORS.primary, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  outlineBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.primary },
  outlineText: { color: COLORS.primary, fontWeight: '700' },
  logoutBtn: { backgroundColor: COLORS.error, marginTop: 20 },
});

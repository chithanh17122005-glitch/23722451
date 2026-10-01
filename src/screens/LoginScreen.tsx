import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Watermark } from '@components/Watermark';
import { COLORS } from '@constants/theme';
import { STUDENT, VARIANT } from '@constants/student';
import { useAuthStore } from '@stores/authStore';

export const LoginScreen = () => {
  const [val, setVal] = useState('');
  const login = useAuthStore((s) => s.login);

  const handleLogin = () => {
    login(val || `0987654321`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Watermark />
      <View style={styles.content}>
        <Text style={styles.title}>KTXGO</Text>
        <Text style={styles.subtitle}>Giao đồ tận phòng ký túc xá</Text>

        <TextInput
          style={styles.input}
          placeholder={VARIANT.authField === 'email' ? `Email — ${STUDENT.mssv}@iuh.edu.vn` : `Phone — 0987654321`}
          value={val}
          onChangeText={setVal}
          keyboardType={VARIANT.authField === 'phone' ? 'phone-pad' : 'email-address'}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Vào cửa hàng</Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>Auth Stack - chưa có token</Text>
      </View>
      <Watermark />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'space-between' },
  content: { padding: 24, alignItems: 'center', justifyContent: 'center', flex: 1 },
  title: { fontSize: 36, fontWeight: '900', color: COLORS.primary, letterSpacing: 1 },
  subtitle: { fontSize: 14, color: COLORS.textLight, marginTop: 4, marginBottom: 32 },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  footerNote: { fontSize: 12, color: COLORS.textLight, marginTop: 16 },
});

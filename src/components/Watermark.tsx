import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { STUDENT, examStamp, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';

export const Watermark = () => {
  return (
    <View style={[styles.container, VARIANT.watermarkAtTop ? styles.top : styles.bottom]}>
      <Text style={styles.text}>
        TH2 · {STUDENT.mssv} · {STUDENT.hoTen} · #{examStamp()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(29, 78, 216, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: { borderBottomWidth: 1, borderColor: COLORS.border },
  bottom: { borderTopWidth: 1, borderColor: COLORS.border },
  text: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

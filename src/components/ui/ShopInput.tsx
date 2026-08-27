import React, { memo } from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
} from 'react-native';

import Typography from './Typography';
import { COLORS, SIZES } from '../../constants/theme';

interface ShopInputProps extends TextInputProps {
    label?: string;
    error?: string;
}

const ShopInput = memo(
    ({
        label,
        error,
        style,
        ...props
    }: ShopInputProps) => {
        return (
            <View style={styles.wrapper}>
                {label && (
                    <Typography variant="small" style={styles.label}>
                        {label}
                    </Typography>
                )}

                <TextInput
                    style={[
                        styles.input,
                        error ? styles.inputError : null,
                        style,
                    ]}
                    placeholderTextColor={COLORS.textLight}
                    {...props}
                />

                {error && (
                    <Typography
                        variant="caption"
                        color={COLORS.error}
                    >
                        {error}
                    </Typography>
                )}
            </View>
        );
    },
);

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: SIZES.md,
    },
    label: {
        marginBottom: SIZES.xs,
    },
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radius,
        paddingHorizontal: SIZES.md,
        paddingVertical: SIZES.md,
    },
    inputError: {
        borderColor: COLORS.error,
    },
});

export default ShopInput;
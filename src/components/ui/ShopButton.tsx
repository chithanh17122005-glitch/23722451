import React, { memo } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleProp,
    StyleSheet,
    ViewStyle,
} from 'react-native';

import Typography from './Typography';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

interface ShopButtonProps {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'outline';
    style?: StyleProp<ViewStyle>;
}

const ShopButton = memo(
    ({
        title,
        onPress,
        isLoading = false,
        disabled = false,
        variant = 'primary',
        style,
    }: ShopButtonProps) => {
        const isPrimary = variant === 'primary';

        return (
            <Pressable
                onPress={onPress}
                disabled={disabled || isLoading}
                style={[
                    styles.button,
                    isPrimary
                        ? styles.primary
                        : styles.outline,
                    disabled || isLoading
                        ? styles.disabled
                        : null,
                    style,
                ]}
            >
                {isLoading ? (
                    <ActivityIndicator
                        color={
                            isPrimary
                                ? COLORS.surface
                                : COLORS.primary
                        }
                    />
                ) : (
                    <Typography
                        variant="button"
                        color={
                            isPrimary
                                ? COLORS.surface
                                : COLORS.primary
                        }
                    >
                        {title}
                    </Typography>
                )}
            </Pressable>
        );
    },
);

const styles = StyleSheet.create({
    button: {
        minHeight: 46,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SIZES.lg,
    },
    primary: {
        backgroundColor: COLORS.primary,
    },
    outline: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    disabled: {
        opacity: 0.5,
    },
});

export default ShopButton;
import React, { memo } from 'react';
import {
    StyleSheet,
    Text,
    TextProps,
    TextStyle,
} from 'react-native';

import { COLORS, FONTS } from '../../constants/theme';

type TypographyVariant =
    | 'title'
    | 'heading'
    | 'bodyLarge'
    | 'body'
    | 'small'
    | 'caption'
    | 'button';

interface TypographyProps extends TextProps {
    variant?: TypographyVariant;
    color?: string;
    children: React.ReactNode;
}

const Typography = memo(
    ({
        variant = 'body',
        color = COLORS.text,
        children,
        style,
        ...props
    }: TypographyProps) => {
        return (
            <Text
                style={[
                    styles.base,
                    { fontSize: FONTS[variant], color },
                    style,
                ]}
                {...props}
            >
                {children}
            </Text>
        );
    },
);

const styles = StyleSheet.create({
    base: {
        fontWeight: '400',
    } as TextStyle,
});

export default Typography;
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ShopStack } from './ShopStack';
import { CartScreen } from '@screens/CartScreen';
import { MeScreen } from '@screens/MeScreen';
import { useCartStore } from '@stores/cartStore';
import { COLORS } from '@constants/theme';

const Tab = createBottomTabNavigator();

export const MainTabs = () => {
  const totalQuantity = useCartStore((s) => s.getTotalQuantity());

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
      }}
    >
      <Tab.Screen name="ShopTab" component={ShopStack} options={{ title: 'Cửa hàng' }} />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          title: 'Giỏ',
          tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
        }}
      />
      <Tab.Screen name="MeTab" component={MeScreen} options={{ title: 'Tôi' }} />
    </Tab.Navigator>
  );
};

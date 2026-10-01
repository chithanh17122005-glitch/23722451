import { useState } from 'react';
import { Linking } from 'react-native';
import { BASE_SHIP_FEE, VARIANT } from '@constants/student';

export function useCampusLocation() {
  const [status, setStatus] = useState<'idle' | 'granted' | 'denied' | 'blocked'>('idle');
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  const requestLocation = async () => {
    try {
      // Mock coordinates simulating student campus distance (~1.2 km)
      setStatus('granted');
      setDistanceKm(1.2);
    } catch {
      setStatus('denied');
    }
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  const calculateShipFee = (): number => {
    if (distanceKm === null) return BASE_SHIP_FEE;
    if (VARIANT.shipFormula === 'A') {
      return BASE_SHIP_FEE + Math.round(distanceKm * 2000);
    } else {
      return BASE_SHIP_FEE + Math.round(distanceKm * 1500) + 2000;
    }
  };

  return { status, distanceKm, requestLocation, openSettings, shipFee: calculateShipFee() };
}

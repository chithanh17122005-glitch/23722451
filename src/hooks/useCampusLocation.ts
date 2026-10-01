import { useState } from 'react';
import * as Location from 'expo-location';
import { Linking } from 'react-native';
import { BASE_SHIP_FEE, VARIANT } from '@constants/student';

const KTX_GATE = { latitude: 10.8231, longitude: 106.6297 };

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function useCampusLocation() {
  const [status, setStatus] = useState<'idle' | 'granted' | 'denied' | 'blocked'>('idle');
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  const requestLocation = async () => {
    try {
      const { status: permStatus, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      if (permStatus === 'granted') {
        setStatus('granted');
        const loc = await Location.getCurrentPositionAsync({});
        const dist = calculateHaversineDistance(
          loc.coords.latitude,
          loc.coords.longitude,
          KTX_GATE.latitude,
          KTX_GATE.longitude
        );
        setDistanceKm(dist);
      } else if (!canAskAgain) {
        setStatus('blocked');
      } else {
        setStatus('denied');
      }
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

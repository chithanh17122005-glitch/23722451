// TH1 | 23722451 | NGUYEN DINH CHI THANH | #STAMP

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from './src/contexts/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
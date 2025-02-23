import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface MotherProps {
  currentFloor: string;
}

export default function Mother({ currentFloor }: MotherProps) {
  if (currentFloor !== 'down') return null;

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/MMC_Mother.png')}
        style={styles.character}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 280,
    left: 535,
    width: 120,
    height: 150,
  },
  character: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
}); 
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface BrotherProps {
  currentFloor: string;
}

export default function Brother({ currentFloor }: BrotherProps) {
  if (currentFloor !== 'up') return null;

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/MMC_Brother.png')}
        style={styles.character}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 500,
    left: 615,
    width: 120,
    height: 150,
  },
  character: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
}); 
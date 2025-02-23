import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface NeighbourProps {
  currentFloor: string;
}

export default function Neighbour({ currentFloor }: NeighbourProps) {
  if (currentFloor !== 'down') return null;

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/MMC_Neighbour.png')}
        style={styles.character}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 580,
    left: 665,
    width: 120,
    height: 150,
  },
  character: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
}); 
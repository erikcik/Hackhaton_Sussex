import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface FatherProps {
  currentFloor: string;
}

export default function Father({ currentFloor }: FatherProps) {
  if (currentFloor !== 'up') return null;

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/MMC_Father.png')}
        style={styles.character}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 500,
    left: 165,
    width: 120,
    height: 150,
  },
  character: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
}); 
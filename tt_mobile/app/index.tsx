import { Image, StyleSheet, Platform, Dimensions, Pressable, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const characters = [
  { 
    id: 1, 
    name: "Mickey", 
    isLocked: false,
    isSelected: true
  },
  { 
    id: 2, 
    name: "Father", 
    isLocked: true,
    isSelected: false
  },
  { 
    id: 3, 
    name: "Mother", 
    isLocked: true,
    isSelected: false
  },
  { 
    id: 4, 
    name: "Neighbor", 
    isLocked: true,
    isSelected: false
  },
];

export default function HomeScreen() {
  const [isWalking, setIsWalking] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sun animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Title animation
    Animated.timing(titleAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleStartClick = () => {
    setIsWalking(true);
    setTimeout(() => {
      router.push('/preferences');
    }, 4300);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Main Content */}
      <ThemedView style={styles.contentContainer}>
        <Animated.View
          style={[{
            transform: [
              { scale: titleAnim },
              { rotate: titleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['-5deg', '0deg']
              })}
            ],
            opacity: titleAnim
          }]}
        >
          <ThemedText style={styles.title}>TinyTalkers</ThemedText>
        </Animated.View>

        <Pressable 
          style={[styles.startButton, isWalking && styles.startButtonDisabled]}
          onPress={handleStartClick}
          disabled={isWalking}
        >
          <ThemedText style={styles.startButtonText}>Start the Fun!</ThemedText>
        </Pressable>

        <ThemedView style={styles.charactersContainer}>
          {characters.map((character) => (
            <Pressable 
              key={character.id}
              style={[
                styles.characterButton,
                character.isSelected && styles.selectedCharacter
              ]}
            >
              <ThemedView
                style={[
                  styles.characterImage,
                  character.isLocked && styles.lockedCharacter
                ]}
              />
              {character.isLocked && (
                <ThemedView style={styles.lockIcon} />
              )}
              <ThemedText style={[
                styles.characterName,
                character.isSelected && styles.selectedCharacterName
              ]}>
                {character.name}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      </ThemedView>

      {/* Scene */}
      <ThemedView style={styles.sceneContainer}>
        <ThemedView style={styles.house} />
        <ThemedView 
          style={[
            styles.character,
            isWalking && styles.walkingCharacter
          ]}
        />
      </ThemedView>

      {/* Grass */}
      <ThemedView style={styles.grass} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // sky blue
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '15%',
    zIndex: 2,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#553C9A',
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 9999,
    elevation: 4,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  charactersContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  characterButton: {
    padding: 8,
    borderWidth: 2,
    borderColor: '#553C9A',
    borderRadius: 9999,
  },
  selectedCharacter: {
    backgroundColor: '#553C9A',
  },
  characterImage: {
    width: 60,
    height: 60,
    borderRadius: 9999,
    backgroundColor: '#DDD',
  },
  lockedCharacter: {
    opacity: 0.5,
  },
  lockIcon: {
    width: 24,
    height: 24,
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: '#000',
    borderRadius: 12,
  },
  selectedCharacterName: {
    fontWeight: 'bold',
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
  sceneContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  house: {
    position: 'absolute',
    right: '10%',
    bottom: '20%',
    width: 100,
    height: 100,
    backgroundColor: '#8B4513',
  },
  character: {
    position: 'absolute',
    bottom: '20%',
    left: '35%',
    width: 50,
    height: 50,
    backgroundColor: '#000',
    borderRadius: 25,
  },
  walkingCharacter: {
    transform: [{translateX: 50}],
  },
  grass: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '20%',
    backgroundColor: '#90EE90',
  },
});

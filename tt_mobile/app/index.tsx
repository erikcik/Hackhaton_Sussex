import { Image, StyleSheet, Platform, Dimensions, Pressable, Animated, Easing, View } from 'react-native';
import { useState, useRef, useEffect } from 'react';

import { Link } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

import { router } from 'expo-router';
import { useFonts, BubblegumSans_400Regular } from '@expo-google-fonts/bubblegum-sans';
import { LinearGradient } from 'expo-linear-gradient';


import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Screen dimensions at the top level
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Character data matching web version
const characters = [
  { 
    id: 1, 
    name: "Mickey", 
    avatar: require("../assets/images/mickey_photos/mickey.png"),
    isLocked: false,
    isSelected: true
  },
  { 
    id: 2, 
    name: "Father", 
    avatar: require("../assets/images/mickey_photos/mickey_father.png"),
    isLocked: true,
    isSelected: false
  },
  { 
    id: 3, 
    name: "Mother", 
    avatar: require("../assets/images/mickey_photos/mickey_mother.png"),
    isLocked: true,
    isSelected: false
  },
  { 
    id: 4, 
    name: "Neighbor", 
    avatar: require("../assets/images/mickey_photos/mickey_neighbor.png"),
    isLocked: true,
    isSelected: false
  },
];

export default function HomeScreen() {
  // 1. All useState hooks
  const [isWalking, setIsWalking] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(1);
  
  // 2. All useRef hooks
  const titleAnim = useRef(new Animated.Value(0)).current;
  const charactersSlideAnim = useRef(new Animated.Value(screenWidth)).current;
  const characterPosition = useRef(new Animated.ValueXY({ 
    x: screenWidth * 0.35,
    y: screenHeight * 0.7
  })).current;

  // 3. Font loading hook
  const [fontsLoaded] = useFonts({
    BubblegumSans_400Regular,
  });

  // 4. All useEffect hooks
  useEffect(() => {
    // Title bounce animation
    Animated.timing(titleAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start();

    // Characters slide-in animation
    Animated.spring(charactersSlideAnim, {
      toValue: 0,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const handleStartClick = () => {
    setIsWalking(true);
    
    // Simplified animation - just walk right
    Animated.timing(characterPosition.x, {
      toValue: screenWidth * 0.45,  // Move slightly right
      duration: 2000,               // 2 seconds
      useNativeDriver: true,
    }).start(() => {
      // After walking animation completes
      setTimeout(() => {
        router.push('/preferences');
      }, 300);
    });
  };

  return (
    <ThemedView style={styles.container}>
      {/* Background Color */}
      <LinearGradient
        colors={[
          '#87CEEB',   // Light sky blue for top half
          '#87CEEB',   // Same light sky blue (for sharp middle)
          '#B0E2FF',   // Lighter blue for transition
          '#E0FFFF',   // Very light cyan for bottom
        ]}
        locations={[0, 0.5, 0.7, 1]}  // Controls the position of each color
        style={styles.backgroundFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Background Map */}
      <Image 
        source={require("../assets/images/transparent_image.png")}
        style={styles.backgroundMap}
        resizeMode="cover"
      />

      {/* Content with animations */}
      <ThemedView style={styles.contentContainer}>
        <Animated.View style={{
          transform: [
            { scale: titleAnim },
            { rotate: titleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['-5deg', '0deg']
            })}
          ],
          opacity: titleAnim
        }}>
          <ThemedText style={styles.title}>TinyTalkers</ThemedText>
        </Animated.View>

        <Pressable 
          style={[styles.startButton, isWalking && styles.startButtonDisabled]}
          onPress={handleStartClick}
          disabled={isWalking}
        >
          <ThemedText style={styles.startButtonText}>Start the Fun!</ThemedText>
        </Pressable>

        <Animated.View style={[
          styles.charactersContainer,
          { transform: [{ translateX: charactersSlideAnim }] }
        ]}>
          {characters.map((character) => (
            <Pressable 
              key={character.id}
              style={[
                styles.characterButton, 
                character.id === selectedCharacter && styles.selectedCharacter
              ]}
              onPress={() => !character.isLocked && setSelectedCharacter(character.id)}
            >
              <Image
                source={character.avatar}
                style={[styles.characterImage, character.isLocked && styles.lockedCharacter]}
              />
              {character.isLocked && (
                <Image 
                  source={require("../assets/images/lock.png")}
                  style={styles.lockIcon}
                />
              )}
              <ThemedText style={[
                styles.characterName,
                character.id === selectedCharacter && styles.selectedCharacterName
              ]}>
                {character.name}
              </ThemedText>
            </Pressable>
          ))}
        </Animated.View>
      </ThemedView>


      {/* Grass */}

      {/* Navigation Button */}
      <Link href="/(tabs)/page" asChild>
        <TouchableOpacity style={styles.homeMapButton}>
          <Text style={styles.homeMapButtonText}>Go to Home Map</Text>
        </TouchableOpacity>
      </Link>

      {/* Mickey Character */}
      <Animated.Image
        source={isWalking ? 
          require("../assets/images/mickey_moving/MMC_Right_Anim.gif") :
          require("../assets/images/mickey_moving/MMC_Front_Anim.gif")
        }
        style={[styles.character, {
          transform: [
            { translateX: characterPosition.x },
            { translateY: characterPosition.y }
          ]
        }]}
        resizeMode="contain"
      />

    </ThemedView>
  );
}

// Styles after the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#90B66D', // Matching the grass background color
  },
  backgroundFill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: screenHeight * 0.15,
    zIndex: 3,  // Above background
  },
  title: {
    fontSize: 48,
    fontFamily: 'BubblegumSans_400Regular',
    fontWeight: 'bold',
    color: '#553C9A',
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  startButton: {
    backgroundColor: '#EF4444', // Red color from web version
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 9999,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    transform: [{ scale: 1.1 }],
  },
  startButtonDisabled: {
    opacity: 0.5,
    transform: [{ scale: 1.0 }],
  },
  startButtonText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'BubblegumSans_400Regular',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  charactersContainer: {
    flexDirection: 'row',
    marginTop: 24,
    paddingHorizontal: 16,
    gap: 12,
  },
  characterButton: {
    alignItems: 'center',
    position: 'relative',
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 9999,
    overflow: 'hidden',
    padding: 2,
  },
  characterImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  selectedCharacter: {
    transform: [{ scale: 1.1 }],
    borderColor: '#EAB308', // Yellow color from web version
    shadowColor: '#EAB308',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  lockedCharacter: {
    opacity: 0.5,
  },
  lockIcon: {
    position: 'absolute',
    width: 24,
    height: 24,
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -12 },
      { translateY: -12 }
    ],
  },
  characterName: {
    fontSize: 14,
    marginTop: 8,
    color: '#553C9A',
    fontFamily: 'BubblegumSans_400Regular',
    fontWeight: '600',
  },
  selectedCharacterName: {
    color: '#EAB308',
    fontWeight: 'bold',
  },
  character: {
    position: 'absolute',
    width: 100,
    height: 100,
    zIndex: 4,  // Topmost layer
  },
  backgroundMap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    zIndex: 2,  // Same level as background gradient
  },
  homeMapButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#FF4081',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    elevation: 8,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: '#FFF',
    transform: [{ scale: 1.1 }],
  },
  homeMapButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

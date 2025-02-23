import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useState, useRef } from 'react';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Base64 encoded pixel art icons - keep these for the interactive points
const CHARACTER_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAYpJREFUWEftl99xgzAMxr8vfQ5D0BF4g2YERugI6QgdoRmBETJCRmhGICN0hI7gPhw+fOeAgQOX3l0fwGDpZ0uyLAn4Z0P+2R/+HGAYhvswDI9pmm7DMNycc1drbdd13TXP832e5/swDI9pmu7DMNycc9e2ba9FUezbtj2XZXnI8/zQtu25KIpDURSHtm3PZVke8jw/tG17Lori8JYA0zQ9nXOXaZqeWJ9zLvV9f+n7/tL3/cU5l6ZpeuJZmqYnACkRHX+c4FSAiGgPgD0wVyI6EdHxNQC+70R0IqLjnANEdASQEtGRiI5EdCSiI4CUAFJKKX+cc7ckSfgsSZIkxHtKKaWUUkrJn1LqRymlUkrJtVJKpZSS+5RSSiml5D2l1I9SSiWAPRHtrbXfxpgvY8yXMebLGPNljPkyxnwZY76MMV/GmC9jzNdsHzDGfBtjvo0x38aYb2PMtzHm2xjzbYz5Nsb8iQNmK2HYcv6UAyG2nD/tQIgt5087EOLL+UsciLHl/CUOFC8pxZbzVwD8Ak5GhyAQHyMLAAAAAElFTkSuQmCC"
const LOCK_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAUNJREFUWEftl1sOwiAQRYfFuATX4A7cgWvQxbgDl+AaXIxrcAeuwSWYeJMmDQUK05kyMSZ+8VB65p07D+AfXsmxvzTG3Ky1j977m3Puaa1d5nl+SilzY8zFWvvw3t+dcytjzNJae0/TdPXeL4wxF2ttWuTVYRjWxphFnuePrutuWZbdx3F8z/P8KgBkrKIoyrquV3meP7uuu2VZdgcEQBZ938/iOK7quv4KgiDEzKK+79dxHFd1XX8AkabpI4qiMk3TZxAEZZqmjyiKyjRNn0EQlGmaPqIoKtM0fQRBUKZp+giCoEzT9BEEQZmm6SMIgjJN00cQBGWapo8gCMo0TR9BEJRpmj6CICjTNH0EQVD2n/QxDMNbzv0kTcMwvLMsuxOR+8LvZ0kAiGhDRHvn3J6I9kS0I6IdEe2IaEdEOyLaEdGOiHZEtCOiHRHt/pHoC3RQbyAQgZNJAAAAAElFTkSuQmCC"
const SCHOOL_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAWVJREFUWEftl0FuwjAQRf+YnKBH6A3oDcoNmhukJ2pvEE7Q3qA9QXuE3qA5QdkFhIVlxx57UkxVVWKVhWV7/t/vGTtZAPhrtWL9vQrgHFwA7gB2AM4ArgAOAD4BvCUFYQHYA3gB8BsUPgF4B/AYFWIBsOEfANcFhY8Anooi3AHYvJvwN/PENhEVwh3AHnGbKfwIgPWxh6gQ7gCU+D8AXEPUc0k4AK44/wSQvhHhAMi5Z8NDQrgA1OZ+ERKiNQBzz9UuHjzXtQSoBXgJcQLAhvNgSc+5AXDxnOcSQgKg3D8BPGQOlgC1EAyQF5L0nBsA557vvSBqAWrFNQDqHWgJYQGgw+UbkEO0AKiFsAAw9/kQSs+5AVDuqefcALjnvJCk59wAuHjW80wOoQDUxlPPuQFQ7qnnXAC4eO5zDqEAYuOpAEqIlgDWc24AXDz1nBuAcs+zXu05NwDlnmf9D8AvwNtxIJoZJ5MAAAAASUVORK5CYII="

export default function Page() {
  const [isExpanding, setIsExpanding] = useState(false);
  const houseScale = useSharedValue(1);
  const schoolScale = useSharedValue(1);
  const lockScale = useSharedValue(1);

  const handlePress = (icon: 'house' | 'school' | 'lock') => {
    // Animate the pressed icon
    const scaleValue = icon === 'house' ? houseScale : 
                      icon === 'school' ? schoolScale : lockScale;
    
    scaleValue.value = withSpring(1.2, {}, () => {
      scaleValue.value = withSpring(1);
    });
    
    // Only expand curtains for house icon
    if (icon === 'house') {
      setIsExpanding(true);
    }
  };

  // Animated styles for each icon
  const houseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -Math.min(width, height) * 0.125 },
      { translateY: -Math.min(width, height) * 0.125 },
      { scale: houseScale.value }
    ]
  }));

  const schoolAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -Math.min(width, height) * 0.125 },
      { translateY: -Math.min(width, height) * 0.125 },
      { scale: schoolScale.value }
    ]
  }));

  const lockAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -Math.min(width, height) * 0.125 },
      { translateY: -Math.min(width, height) * 0.125 },
      { scale: lockScale.value }
    ]
  }));

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.background} />
      
      {/* Left Cloud Curtain */}
      <Animated.View style={[styles.leftCurtain, isExpanding && styles.expandedCurtain]}>
        <View style={styles.curtainFill} />
        <View style={styles.cloudContainer}>
          {[...Array(10)].map((_, index) => (
            <CloudRight key={index} />
          ))}
        </View>
      </Animated.View>

      {/* Right Cloud Curtain */}
      <Animated.View style={[styles.rightCurtain, isExpanding && styles.expandedCurtain]}>
        <View style={styles.cloudContainer}>
          {[...Array(10)].map((_, index) => (
            <CloudLeft key={index} />
          ))}
        </View>
        <View style={styles.curtainFill} />
      </Animated.View>

      {/* Centered Map Container */}
      <View style={styles.mapContainer}>
        <Image
          source={require('./assets/images/Map.png')}
          style={styles.map}
          contentFit="contain"
        />
        
        {/* Interactive Points */}
        <Animated.View style={[styles.interactivePoint, styles.housePosition, houseAnimatedStyle]}>
          <Pressable 
            style={styles.pressable}
            onPress={() => handlePress('house')}
          >
            <Image
              source={require('./assets/images/house.png')}
              style={styles.icon}
              contentFit="contain"
            />
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.interactivePoint, styles.schoolPosition, schoolAnimatedStyle]}>
          <Pressable 
            style={styles.pressable}
            onPress={() => handlePress('school')}
          >
            <Image
              source={require('./assets/images/school.png')}
              style={styles.icon}
              contentFit="contain"
            />
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.interactivePoint, styles.lockPosition, lockAnimatedStyle]}>
          <Pressable 
            style={styles.pressable}
            onPress={() => handlePress('lock')}
          >
            <Image
              source={require('./assets/images/lock.png')}
              style={styles.icon}
              contentFit="contain"
            />
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

function CloudRight() {
  return (
    <View style={styles.cloudRight}>
      {[3, 4, 6, 5, 4, 3].map((size, index) => (
        <View key={index} style={[styles.cloudSegment, { width: size * 4, height: size * 4 }]} />
      ))}
    </View>
  );
}

function CloudLeft() {
  return (
    <View style={styles.cloudLeft}>
      {[3, 4, 6, 5, 4, 3].map((size, index) => (
        <View key={index} style={[styles.cloudSegment, { width: size * 4, height: size * 4 }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#90B66D', // Grass green background
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#90B66D',
  },
  leftCurtain: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 48,
    flexDirection: 'row',
    zIndex: 10,
  },
  rightCurtain: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 48,
    flexDirection: 'row',
    zIndex: 10,
  },
  expandedCurtain: {
    width: width / 2,
  },
  curtainFill: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  cloudContainer: {
    height: '100%',
    width: 24,
    flexShrink: 0,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 48,
  },
  map: {
    width: Math.min(width, height) * 3.9, // Increased from 1.2 to 1.5
    aspectRatio: 1,
    position: 'relative',
  },
  interactivePoint: {
    position: 'absolute',
    width: Math.min(width, height) * 0.25,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  pressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  housePosition: {
    left: '65%',
    top: '85%',
  },
  schoolPosition: {
    left: '44%',
    top: '25%',
  },
  lockPosition: {
    left: '65%',
    top: '45%',
  },
  cloudRight: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    opacity: 0.7,
  },
  cloudLeft: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    opacity: 0.7,
    transform: [{ scaleY: -1 }],
  },
  cloudSegment: {
    backgroundColor: 'white',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    marginTop: -4,
  },
});


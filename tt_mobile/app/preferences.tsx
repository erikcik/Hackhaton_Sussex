import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Pressable, Dimensions, TextInput } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeIn,
  interpolate,
  useAnimatedStyle,
  withTiming,
  useSharedValue
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type PreferenceStep = 'name' | 'gender' | 'languages' | 'age' | 'complete';

type UserPreferences = {
  firstName: string;
  lastName: string;
  gender: string;
  mainLanguage: string;
  preferredLanguage: string;
  age: number;
};

export default function PreferencesScreen() {
  const [step, setStep] = useState<PreferenceStep>('name');
  const [preferences, setPreferences] = useState<UserPreferences>({
    firstName: '',
    lastName: '',
    gender: 'other',
    mainLanguage: '',
    preferredLanguage: '',
    age: 0
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionProgress = useSharedValue(0);

  useEffect(() => {
    if (step === 'complete') {
      const timer = setTimeout(() => {
        router.replace('/page');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const renderStep = () => {
    switch (step) {
      case 'name':
        return (
          <Animated.View 
            entering={FadeInDown}
            style={styles.stepContainer}
          >
            <ThemedText style={styles.title}>What's your name? 🌟</ThemedText>
            <ThemedView style={styles.inputContainer}>
              <TextInput style={styles.input} 
                placeholder="First Name"
                value={preferences.firstName}
                onChangeText={(text: string) => setPreferences({ ...preferences, firstName: text })}
              />
              <TextInput style={styles.input}
                placeholder="Last Name"
                value={preferences.lastName}
                onChangeText={(text: string) => setPreferences({ ...preferences, lastName: text })}
              />
            </ThemedView>
            <Pressable
              style={styles.nextButton}
              onPress={() => setStep('gender')}
            >
              <ThemedText style={styles.buttonText}>Next! 👉</ThemedText>
            </Pressable>
          </Animated.View>
        );

      case 'gender':
        return (
          <Animated.View 
            entering={FadeInDown}
            style={styles.stepContainer}
          >
            <ThemedText style={styles.title}>I am a... 🎈</ThemedText>
            <ThemedView style={styles.genderContainer}>
              {['boy', 'girl', 'other'].map((gender) => (
                <Pressable
                  key={gender}
                  style={[
                    styles.genderButton,
                    preferences.gender === gender && styles.selectedGender
                  ]}
                  onPress={() => {
                    setPreferences({ ...preferences, gender });
                    setStep('languages');
                  }}
                >
                  <ThemedText style={[
                    styles.genderText,
                    preferences.gender === gender && styles.selectedGenderText
                  ]}>
                    {gender === 'boy' ? '👦' : gender === 'girl' ? '👧' : '🌈'} {gender}
                  </ThemedText>
                </Pressable>
              ))}
            </ThemedView>
          </Animated.View>
        );

      case 'languages':
        return (
          <Animated.View 
            entering={FadeInDown}
            style={styles.stepContainer}
          >
            <ThemedText style={styles.title}>What languages do you speak? 🗣️</ThemedText>
            <ThemedView style={styles.inputContainer}>
              <Pressable
                style={styles.languageSelect}
                onPress={() => {/* Add language picker logic */}}
              >
                <ThemedText style={styles.selectText}>
                  {preferences.mainLanguage || "Select main language"}
                </ThemedText>
              </Pressable>
              <Pressable
                style={styles.languageSelect}
                onPress={() => {/* Add language picker logic */}}
              >
                <ThemedText style={styles.selectText}>
                  {preferences.preferredLanguage || "Select preferred language"}
                </ThemedText>
              </Pressable>
            </ThemedView>
            <Pressable
              style={styles.nextButton}
              onPress={() => setStep('age')}
            >
              <ThemedText style={styles.buttonText}>Next! 👉</ThemedText>
            </Pressable>
          </Animated.View>
        );

      case 'age':
        return (
          <Animated.View 
            entering={FadeInDown}
            style={styles.stepContainer}
          >
            <ThemedText style={styles.title}>How old are you? 🎂</ThemedText>
            <TextInput style={styles.input}
              placeholder="Age"
              keyboardType="numeric"
              maxLength={2}
              value={preferences.age.toString()}
              onChangeText={(text: string) => setPreferences({ ...preferences, age: parseInt(text) || 0 })}
            />
            <Pressable
              style={styles.nextButton}
              onPress={() => setStep('complete')}
            >
              <ThemedText style={styles.buttonText}>Finish! 🎉</ThemedText>
            </Pressable>
          </Animated.View>
        );

      case 'complete':
        return (
          <Animated.View 
            entering={FadeIn}
            style={[styles.stepContainer, styles.completeContainer]}
          >
            <ThemedText style={styles.title}>All Done! 🎉</ThemedText>
            <ThemedText style={styles.subtitle}>
              Welcome to Tiny Town!
            </ThemedText>
            <ThemedText style={styles.emoji}>🌟</ThemedText>
          </Animated.View>
        );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce7f3', // pink-100 equivalent
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7c3aed', // purple-600 equivalent
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    gap: 16,
  },
  input: {
    width: '100%',
    padding: 16,
    borderWidth: 4,
    borderColor: '#fbbf24', // yellow-400 equivalent
    borderRadius: 16,
    fontSize: 20,
  },
  nextButton: {
    width: '100%',
    padding: 16,
    backgroundColor: '#4ade80', // green-400 equivalent
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  genderButton: {
    flex: 1,
    padding: 24,
    backgroundColor: '#dbeafe', // blue-100 equivalent
    borderRadius: 16,
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: '#60a5fa', // blue-400 equivalent
  },
  genderText: {
    fontSize: 20,
    color: '#1e40af', // blue-800 equivalent
    textAlign: 'center',
  },
  selectedGenderText: {
    color: 'white',
  },
  languageSelect: {
    width: '100%',
    padding: 16,
    borderWidth: 4,
    borderColor: '#fbbf24',
    borderRadius: 16,
  },
  selectText: {
    fontSize: 20,
  },
  completeContainer: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: '#4b5563', // gray-600 equivalent
    textAlign: 'center',
  },
  emoji: {
    fontSize: 64,
    marginTop: 24,
  },
}); 
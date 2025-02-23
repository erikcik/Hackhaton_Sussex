import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Pressable, Dimensions, TextInput, SafeAreaView, View, Modal } from 'react-native';
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
    gender: 'boy',
    mainLanguage: '',
    preferredLanguage: '',
    age: 0
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionProgress = useSharedValue(0);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [currentLanguageType, setCurrentLanguageType] = useState<'main' | 'preferred'>('main');

  const languages = [
    'English',
    'Spanish',
    'French',
    'Turkish'
  ];

  const handleLanguageSelect = (language: string) => {
    if (currentLanguageType === 'main') {
      setPreferences({ ...preferences, mainLanguage: language });
    } else {
      setPreferences({ ...preferences, preferredLanguage: language });
    }
    setIsLanguageModalVisible(false);
  };

  const renderStep = () => {
    switch (step) {
      case 'name':
        return (
          <Animated.View 
            entering={FadeInDown}
            style={styles.stepContainer}
          >
            <ThemedText style={styles.title}>What's your name? 🌟</ThemedText>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input} 
                placeholder="First Name"
                value={preferences.firstName}
                onChangeText={(text: string) => setPreferences({ ...preferences, firstName: text })}
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={preferences.lastName}
                onChangeText={(text: string) => setPreferences({ ...preferences, lastName: text })}
                placeholderTextColor="#9ca3af"
              />
            </View>
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
            <View style={styles.genderContainer}>
              {['boy', 'girl'].map((gender) => (
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
                    {gender === 'boy' ? '👦' : '👩'} {gender}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        );

      case 'languages':
        return (
          <Animated.View 
            entering={FadeInDown}
            style={styles.stepContainer}
          >
            <View style={styles.titleContainer}>
              <ThemedText style={styles.title}>What languages do you</ThemedText>
              <ThemedText style={[styles.title, { marginTop: -20 }]}>speak? 🗣️</ThemedText>
            </View>
            <View style={styles.inputContainer}>
              <Pressable
                style={styles.languageSelect}
                onPress={() => {
                  setCurrentLanguageType('main');
                  setIsLanguageModalVisible(true);
                }}
              >
                <ThemedText style={styles.selectText}>
                  {preferences.mainLanguage || "Select main language"}
                </ThemedText>
              </Pressable>
              <Pressable
                style={styles.languageSelect}
                onPress={() => {
                  setCurrentLanguageType('preferred');
                  setIsLanguageModalVisible(true);
                }}
              >
                <ThemedText style={styles.selectText}>
                  {preferences.preferredLanguage || "Select preferred language"}
                </ThemedText>
              </Pressable>
            </View>
            <Pressable
              style={styles.nextButton}
              onPress={() => setStep('age')}
            >
              <ThemedText style={styles.buttonText}>Next! 👉</ThemedText>
            </Pressable>

            <Modal
              visible={isLanguageModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setIsLanguageModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <ThemedText style={styles.modalTitle}>
                    Select {currentLanguageType === 'main' ? 'Main' : 'Preferred'} Language
                  </ThemedText>
                  <ScrollView style={styles.languageList}>
                    {languages.map((language) => (
                      <Pressable
                        key={language}
                        style={styles.languageOption}
                        onPress={() => handleLanguageSelect(language)}
                      >
                        <ThemedText style={styles.languageOptionText}>{language}</ThemedText>
                      </Pressable>
                    ))}
                  </ScrollView>
                  <Pressable
                    style={styles.cancelButton}
                    onPress={() => setIsLanguageModalVisible(false)}
                  >
                    <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </Animated.View>
        );

      case 'age':
        return (
          <Animated.View 
            entering={FadeInDown}
            style={styles.stepContainer}
          >
            <ThemedText style={styles.title}>How old are you? 🎂</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Age"
              keyboardType="numeric"
              maxLength={2}
              value={preferences.age.toString()}
              onChangeText={(text: string) => setPreferences({ ...preferences, age: parseInt(text) || 0 })}
              placeholderTextColor="#9ca3af"
            />
            <Pressable
              style={styles.nextButton}
              onPress={() => {
                setStep('complete');
                setIsTransitioning(true);
                setTimeout(() => {
                  router.push('/');
                }, 2000);
              }}
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
              Thanks for sharing your preferences!
            </ThemedText>
            <ThemedText style={styles.emoji}>🌟</ThemedText>
          </Animated.View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce7f3', // Main app background (pink-100)
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  stepContainer: {
    minHeight: Dimensions.get('window').height * 0.8,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 24,
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7c3aed',
    textAlign: 'center',
    paddingVertical: 20,
    marginTop: 20,
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
    color: '#1f2937', // text color
    backgroundColor: '#fff', // Input fields background (white)
  },
  nextButton: {
    width: '100%',
    padding: 16,
    backgroundColor: '#4ade80', // Next button background (green-400)
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
    backgroundColor: '#dbeafe', // Unselected gender button background (blue-100)
    borderRadius: 16,
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: '#60a5fa', // Selected gender button background (blue-400)
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
    backgroundColor: '#fff', // Language select background (currently not set - let's add it)
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
  titleContainer: {
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7c3aed',
    textAlign: 'center',
    marginBottom: 20,
  },
  languageList: {
    maxHeight: 300,
  },
  languageOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  languageOptionText: {
    fontSize: 18,
    color: '#1f2937',
  },
  cancelButton: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#ef4444',
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 
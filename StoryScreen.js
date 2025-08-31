import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import stories from '../utils/storyData';
import styles from '../styles/storyStyle'; // Adjust if needed

const StoryScreen = () => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionPress = (option) => {
    const currentScene = stories[selectedStoryIndex].scenes[sceneIndex];
    if (option === currentScene.correctAnswer) {
      setShowExplanation(true);
    } else {
      Alert.alert('Think Again', 'That might not be the safest or most empowering option. Try again!');
    }
  };

  const goToNextScene = () => {
    setShowExplanation(false);
    const currentStory = stories[selectedStoryIndex];

    if (sceneIndex + 1 < currentStory.scenes.length) {
      setSceneIndex(sceneIndex + 1);
    } else {
      Alert.alert('Story Complete', 'You have completed this story.');
      setSelectedStoryIndex(null);
      setSceneIndex(0);
    }
  };

  const handleStorySelect = (index) => {
    setSelectedStoryIndex(index);
    setSceneIndex(0);
    setShowExplanation(false);
  };

  if (selectedStoryIndex === null) {
    // Story selection screen
    return (
      <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
        <Text style={styles.title}>Choose a Story</Text>
        {stories.map((story, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.optionButton}
            onPress={() => handleStorySelect(idx)}
          >
            <Text style={styles.optionText}>{story.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  const currentStory = stories[selectedStoryIndex];
  const currentScene = currentStory.scenes[sceneIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{currentStory.title}</Text>
      <Text style={styles.scene}>{currentScene.content}</Text>
      <Text style={styles.question}>{currentScene.question}</Text>

      {currentScene.options.map((option, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.optionButton}
          onPress={() => handleOptionPress(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}

      {showExplanation && (
        <>
          <Text style={styles.explanation}>✅ {currentScene.explanation}</Text>
          <Text style={styles.legalInsight}>📘 Legal Insight: {currentScene.legalInsight}</Text>
          <TouchableOpacity style={styles.nextButton} onPress={goToNextScene}>
            <Text style={styles.nextButtonText}>
              {sceneIndex + 1 < currentStory.scenes.length ? 'Next Scene' : 'Finish Story'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default StoryScreen;

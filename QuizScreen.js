import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const questions = [
  {
    key: 'emotionalWellBeing',
    question: 'How often do you feel emotionally overwhelmed?',
    options: ['Never', 'Sometimes', 'Often', 'Always'],
  },
  {
    key: 'stressLevels',
    question: 'How often do you feel stressed or under pressure?',
    options: ['Never', 'Sometimes', 'Often', 'Always'],
  },
  {
    key: 'anxiety',
    question: 'How often do you feel anxious or nervous?',
    options: ['Never', 'Sometimes', 'Often', 'Always'],
  },
  {
    key: 'sleepQuality',
    question: 'Do you have trouble falling asleep at night?',
    options: ['No', 'Yes'],
  },
  {
    key: 'motivation',
    question: 'How motivated do you feel to accomplish daily tasks?',
    options: ['Low', 'Moderate', 'High'],
  },
  {
    key: 'socialConnections',
    question: 'Do you feel connected to friends or family?',
    options: ['Never', 'Sometimes', 'Often'],
  },
  {
    key: 'energyLevels',
    question: 'How often do you feel drained or fatigued?',
    options: ['Never', 'Sometimes', 'Often'],
  },
  {
    key: 'selfCare',
    question: 'How often do you take time for yourself?',
    options: ['Never', 'Sometimes', 'Often'],
  },
  {
    key: 'mentalClarity',
    question: 'Do you experience mental fog or difficulty concentrating?',
    options: ['No', 'Yes'],
  },
];

export default function MentalHealthQuizScreen() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (questionKey, answer) => {
    setAnswers(prev => ({ ...prev, [questionKey]: answer }));
  };

  const renderQuestion = (questionKey, questionText, options) => (
    <View
      key={questionKey}
      style={{
        marginBottom: 20,
        backgroundColor: '#FFF6E5',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#4E342E' }}>{questionText}</Text>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          style={{
            backgroundColor: answers[questionKey] === option ? '#F4A261' : '#FDEBD2',
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 8,
            marginBottom: 8,
          }}
          onPress={() => handleAnswer(questionKey, option)}
        >
          <Text style={{ fontSize: 16 }}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const generateChallenges = () => {
    let challenges = [];

    if (answers.stressLevels === 'Often' || answers.anxiety === 'Often') {
      challenges.push({
        title: 'Practice Mindfulness',
        explanation: 'Reduce anxiety and stress by practicing mindfulness daily.',
        target: 'Do this for at least 10 minutes every day.',
      });
    }

    if (answers.sleepQuality === 'Yes') {
      challenges.push({
        title: 'Establish a Sleep Routine',
        explanation: 'Improve your sleep quality by going to bed at a consistent time.',
        target: 'Follow a bedtime routine for 7 consecutive days.',
      });
    }

    if (answers.socialConnections === 'Never' || answers.socialConnections === 'Sometimes') {
      challenges.push({
        title: 'Reconnect with Loved Ones',
        explanation: 'Strengthen social bonds by reaching out to friends or family.',
        target: 'Call or meet at least one person you care about this week.',
      });
    }

    if (answers.energyLevels === 'Often') {
      challenges.push({
        title: 'Prioritize Self-Care',
        explanation: 'Boost your energy by dedicating time to activities that recharge you.',
        target: 'Spend 30 minutes daily on a self-care activity.',
      });
    }

    if (answers.motivation === 'Low') {
      challenges.push({
        title: 'Set Small Achievable Goals',
        explanation: 'Regain motivation by setting and completing small goals.',
        target: 'Complete 1 small task daily for the next 7 days.',
      });
    }

    if (challenges.length === 0) {
      challenges.push({
        title: 'Keep Up the Good Work!',
        explanation: 'Your responses show strong mental well-being. Maintain your habits!',
        target: 'Continue practicing your healthy routines every day.',
      });
    }

    return challenges;
  };

  const generateAnalysis = () => {
    let issues = [];

    if (answers.stressLevels === 'Often' || answers.anxiety === 'Often') {
      issues.push('You seem to be experiencing high stress or anxiety.');
    }
    if (answers.sleepQuality === 'Yes') {
      issues.push('Sleep disturbances are affecting your well-being.');
    }
    if (answers.socialConnections === 'Never' || answers.socialConnections === 'Sometimes') {
      issues.push('You may feel socially disconnected.');
    }
    if (answers.energyLevels === 'Often') {
      issues.push('Low energy levels could be impacting your day-to-day life.');
    }
    if (answers.motivation === 'Low') {
      issues.push('Motivation levels are currently low.');
    }

    if (issues.length === 0) {
      return 'Great job! Your responses indicate overall good mental well-being. 🌟';
    }

    return issues.join(' ');
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    const challenges = generateChallenges();
    const analysis = generateAnalysis();

    return (
      <View style={{ flex: 1, backgroundColor: '#FCEFCB' }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 20, marginTop: 10, color: '#6D4C41' }}>
            Personalized Challenges 🎯
          </Text>

          {challenges.map((challenge, index) => (
            <View key={index} style={{
              marginBottom: 20,
              backgroundColor: '#FFF3E0',
              padding: 16,
              borderRadius: 12,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 2
            }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#6D4C41' }}>{challenge.title}</Text>
              <Text style={{ marginTop: 6 }}>{challenge.explanation}</Text>
              <Text style={{ marginTop: 6, fontStyle: 'italic' }}>{challenge.target}</Text>
            </View>
          ))}

          <Text style={{ fontSize: 22, fontWeight: '700', marginTop: 30, marginBottom: 10, color: '#6D4C41' }}>
            Your Mental Health Analysis 🧠
          </Text>
          <Text style={{ fontSize: 16 }}>{analysis}</Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FCEFCB' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 26, fontWeight: '700', marginBottom: 20, color: '#4E342E', marginTop: 20 }}>
          Mental Health Quiz 🧘
        </Text>

        {questions.map(q => renderQuestion(q.key, q.question, q.options))}

        <TouchableOpacity
          style={{
            backgroundColor: '#F4A261',
            paddingVertical: 15,
            borderRadius: 12,
            marginTop: 30,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
          onPress={handleSubmit}
        >
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

import React, { useState, useCallback } from 'react';
import { View, Image, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';
import process from 'process';

global.Buffer = Buffer;
global.process = process;


// Screens
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import UserHome from './screens/UserHome';
import PsychiatristHome from './screens/PsychiatristHome';
import MentalHealthChatbot from './screens/MentalHealthChatbot';
import SOSScreen from './screens/SOSScreen';
import DailyChallengeScreen from './screens/DailyChallengeScreen';
import StoryScreen from './screens/StoryScreen';
import ScheduleCallScreen from './screens/ScheduleCallScreen';
import UserScheduledCallScreen from './screens/UserScheduledCallScreen';
import RecordVideoScreen from './screens/RecordVideoScreen';
import QuizScreen from './screens/QuizScreen';
import MeditationArticleScreen from './articles/MeditationArticleScreen';
import SleepArticleScreen from './articles/SleepArticleScreen';
import HabitArticleScreen from './articles/HabitArticleScreen';
import SocialArticleScreen from './articles/SocialArticleScreen';
import RewardsScreen from './screens/RewardsScreen';
import ProfileScreen from './screens/ProfileScreen';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// ✅ Bottom Tab Navigator
function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Rewards') iconName = 'gift-outline';
          else if (route.name === 'Profile') iconName = 'person-circle-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#A76545',
        tabBarInactiveTintColor: '#8B5E3C',
        tabBarStyle: { backgroundColor: '#F8F3D9' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={UserHome} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen} // Empty view; no navigation
       
      />
    </Tab.Navigator>
  );
}

// ✅ Drawer with Tab Navigator inside
function UserDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <View style={{ flex: 1, backgroundColor: '#F8F3D9' }}>
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Image
              source={require('./design/icons/safenest-logo.png')}
              style={{
                width: 100,
                height: 100,
                resizeMode: 'contain',
                opacity: 0.7,
                marginBottom: 10,
              }}
            />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#A76545' }}>SafeNest</Text>
          </View>

          <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
            <DrawerItemList {...props} />
          </View>
        </View>
      )}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
        drawerStyle: {
          backgroundColor: '#F8F3D9',
          width: 250,
        },
        drawerLabelStyle: {
          color: '#8B5E3C',
          fontSize: 18,
        },
        drawerActiveTintColor: '#A76545',
        drawerInactiveTintColor: '#8B5E3C',
      }}
    >
      <Drawer.Screen name="UserHome" component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = Font.useFonts({
    Tagesschrift: require('./assets/fonts/Tagesschrift.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Drawer" component={UserDrawerNavigator} />
        <Stack.Screen name="PsychiatristHome" component={PsychiatristHome} />
        <Stack.Screen name="ScheduleCallScreen" component={ScheduleCallScreen} />
        <Stack.Screen name="MentalHealthChatbot" component={MentalHealthChatbot} />
        <Stack.Screen name="SOSScreen" component={SOSScreen} />
        <Stack.Screen name="DailyChallengeScreen" component={DailyChallengeScreen} />
        <Stack.Screen name="QuizScreen" component={QuizScreen} />
        <Stack.Screen name="StoryScreen" component={StoryScreen} />
        <Stack.Screen name="UserScheduledCallScreen" component={UserScheduledCallScreen} />
        <Stack.Screen name="RecordVideo" component={RecordVideoScreen} />
        <Stack.Screen name="MeditationArticle" component={MeditationArticleScreen} />
        <Stack.Screen name="SleepArticle" component={SleepArticleScreen} />
        <Stack.Screen name="HabitArticle" component={HabitArticleScreen} />
        <Stack.Screen name="SocialArticle" component={SocialArticleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

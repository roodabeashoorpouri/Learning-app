import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { MainTabsStudentBookIcon, MainTabsWorkbookIcon, MainTabsProfileIcon } from './tabIcons';
import { StudentBookScreen } from '../../screens/StudentBookScreen';
import { WorkbookScreen } from '../../screens/WorkbookScreen';
import { ProfileScreen } from '../../screens/ProfileScreen';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: '#f7f4ec',
          borderTopColor: '#1a3d5c',
          borderTopWidth: 2,
        },
        tabBarActiveTintColor: '#0f2744',
        tabBarInactiveTintColor: '#2d4a66',
      }}
    >
      <Tab.Screen
        name="StudentBook"
        component={StudentBookScreen}
        options={{
          title: 'Student Book',
          tabBarLabel: 'Student Book',
          headerStyle: { backgroundColor: '#f7f4ec' },
          headerTitleStyle: { color: '#0f2744', fontWeight: '800' },
          tabBarIcon: MainTabsStudentBookIcon,
        }}
      />
      <Tab.Screen
        name="Workbook"
        component={WorkbookScreen}
        options={{
          title: 'Workbook',
          tabBarLabel: 'Workbook',
          headerStyle: { backgroundColor: '#f7f4ec' },
          headerTitleStyle: { color: '#0f2744', fontWeight: '800' },
          tabBarIcon: MainTabsWorkbookIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          headerStyle: { backgroundColor: '#f7f4ec' },
          headerTitleStyle: { color: '#0f2744', fontWeight: '800' },
          tabBarIcon: MainTabsProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
}


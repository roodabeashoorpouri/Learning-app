import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { MainTabsProfileIcon } from './tabIcons';
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
      }}
    >
      <Tab.Screen
        name="StudentBook"
        component={StudentBookScreen}
        options={{ title: 'Student Book', tabBarLabel: 'Student Book' }}
      />
      <Tab.Screen
        name="Workbook"
        component={WorkbookScreen}
        options={{ title: 'Workbook', tabBarLabel: 'Workbook' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          // Keeping icon as a tiny styled component avoids extra icon dependencies.
          tabBarIcon: MainTabsProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
}


import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../Components/Pages/Profile/Profile";
import ProfileSetting from "../Components/Pages/ProfileSetting/ProfileSetting";

const ProfileStack = createNativeStackNavigator();

const ProfileNavigation = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile2"
        component={Profile}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="Profile Setting"
        component={ProfileSetting}
        options={{ headerShown: false }}
      />
    </ProfileStack.Navigator>
  );
};

export default ProfileNavigation;

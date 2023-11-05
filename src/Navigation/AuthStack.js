import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "../Components/Pages/SignIn/SignIn";
import SignUp from "../Components/Pages/SignUp/SignUp";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;

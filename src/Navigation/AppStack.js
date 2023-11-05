import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext } from "../Context/AuthProvider";
import DrawerNavigator from "./DrawerNavigator";
import ProfileNavigation from "./ProfileNavigation";
import { Image } from "react-native";

const Tab = createBottomTabNavigator();

const AppStack = () => {
  const { user } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: { backgroundColor: "#1F1E2E" },
        tabBarInactiveTintColor: "white",
        tabBarActiveTintColor: "yellow",
      }}
    >
      {(user?.role === "admin" || user?.role === "user") && (
        <Tab.Screen
          name="Dashboard2"
          component={DrawerNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require("../../assets/home_8255990.png")}
                style={{ width: 30, height: 30 }}
              />
            ),
          }}
        />
      )}
      {(user?.role === "admin" || user?.role === "user") && (
        <Tab.Screen
          name="Profile"
          component={ProfileNavigation}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require("../../assets/user_10241071.png")}
                style={{ width: 33.5, height: 33.5 }}
              />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default AppStack;

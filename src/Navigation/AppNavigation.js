import { StatusBar } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import Loader from "../Components/Shared/Loader/Loader";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";

const AppNavigation = () => {
  const { isLoading, token } = useContext(AuthContext);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {token !== null ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigation;

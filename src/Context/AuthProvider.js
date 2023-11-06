import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { BaseURL } from "../Components/Shared/BaseURL/BaseURL";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const login = async (token) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BaseURL}/api/auth/user-info`, {
        token,
      });
      const userData = response.data.data;
      setUser(userData);
      setToken(token);

      await AsyncStorage.multiSet([
        ["user", JSON.stringify(userData)],
        ["accessToken", token],
      ]);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setToken(null);
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("accessToken");
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userInfo = await AsyncStorage.getItem("user");
      let userToken = await AsyncStorage.getItem("accessToken");
      userInfo = JSON.parse(userInfo);
      if (userInfo) {
        setToken(userToken);
        setUser(userInfo);
      }
      setIsLoading(false);
    } catch (e) {}
  };

  const refreshUser = async () => {
    try {
      const response = await axios.post(`${BaseURL}/api/auth/user-info`, {
        token,
      });
      const userData = response.data.data;
      setUser(userData);

      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {}
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isLoading,
        setIsLoading,
        token,
        user,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

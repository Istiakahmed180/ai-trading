import {
  View,
  Text,
  ToastAndroid,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthProvider";
import { BaseURL } from "../../Shared/BaseURL/BaseURL";
import axios from "axios";
import Loader from "../../Shared/Loader/Loader";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Fontisto, Ionicons, Octicons } from "@expo/vector-icons";
import { CheckBox } from "react-native-elements";
import { useState } from "react";
import {
  useFonts,
  Raleway_700Bold,
  Raleway_600SemiBold,
} from "@expo-google-fonts/raleway";
import { Nunito_400Regular } from "@expo-google-fonts/nunito";

const SignIn = ({ navigation }) => {
  const { login, isLoading, setIsLoading } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    if (userInfo.email && userInfo.password) {
      setIsLoading(true);
      const userInfoData = {
        email: userInfo.email,
        password: userInfo.password,
      };

      try {
        const response = await axios.post(
          `${BaseURL}/api/auth/login`,
          userInfoData
        );

        const data = response.data;

        if (data.message === "Login Successful") {
          const token = data.data;
          login(token);
          ToastAndroid.show(data.message, ToastAndroid.SHORT);
        } else if (data.message === "password not Match") {
          ToastAndroid.show(data.message, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show("Invalid User", ToastAndroid.SHORT);
        }
      } catch (error) {
        ToastAndroid.show("An error occurred", ToastAndroid.SHORT);
      } finally {
        setIsLoading(false);
      }
    } else {
      ToastAndroid.show("Fill Up The Required Fields", ToastAndroid.SHORT);
      setIsLoading(false);
    }
  };

  const handleEmailValidation = (value) => {
    const email = value;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailRegex.test(email)) {
      setError({ ...error, email: "Invalid Email" });
      setUserInfo({ ...userInfo, email: "" });
    } else {
      setError({ ...error, email: "" });
      setUserInfo({ ...userInfo, email: email });
    }
  };

  const handlePasswordValidation = (value) => {
    const password = value;

    const passwordSpecialCharacter = /(?=.*[!@#$&*])/;
    const passwordOneNumber = /(?=.*[0-9])/;
    const passwordSixValue = /(?=.{6,})/;

    if (!passwordSpecialCharacter.test(password)) {
      setError({
        ...error,
        password: "Password must contain at least one special character",
      });
      setUserInfo({ ...userInfo, password: "" });
    } else if (!passwordOneNumber.test(password)) {
      setError({
        ...error,
        password: "Password must contain at least one number",
      });
      setUserInfo({ ...userInfo, password: "" });
    } else if (!passwordSixValue.test(password)) {
      setError({
        ...error,
        password: "Password must be at least 6 characters",
      });
      setUserInfo({ ...userInfo, password: "" });
    } else {
      setError({ ...error, password: "" });
      setUserInfo({ ...userInfo, password: password });
    }
  };

  let [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
    Raleway_700Bold,
    Nunito_400Regular,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <LinearGradient colors={["#1F0545", "#2F065C"]} style={styles.container}>
      <View style={styles.mainContainer}>
        <Image
          source={require("../../../../assets/sign_in.png")}
          style={styles.signInImage}
        />

        <Text style={styles.loginText}>Signin</Text>

        <View>
          <Text style={styles.signinContinue}>Please sign in to continue.</Text>

          {error.email && (
            <View style={styles.emailErrorContainer}>
              <Ionicons name="close" size={16} color={"red"} />
              <Text style={styles.emailErrorText}>{error.email}</Text>
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <View>
            <Fontisto
              style={styles.emailIcon}
              name="email"
              size={20}
              color={"#DDDCE2"}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={"#DDDCE2"}
              keyboardType="name-phone-pad"
              onChangeText={handleEmailValidation}
            />
          </View>

          <View>
            <Octicons
              style={styles.emailIcon}
              name="key"
              size={20}
              color={"#DDDCE2"}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={"#DDDCE2"}
              keyboardType="default"
              secureTextEntry={visible ? false : true}
              onChangeText={handlePasswordValidation}
            />
            {visible ? (
              <Feather
                style={styles.eyeIcon}
                onPress={() => setVisible(!visible)}
                name="eye-off"
                size={20}
                color={"#DDDCE2"}
              />
            ) : (
              <Feather
                style={styles.eyeIcon}
                onPress={() => setVisible(!visible)}
                name="eye"
                size={20}
                color={"#DDDCE2"}
              />
            )}
          </View>
        </View>
        <View>
          {error.password && (
            <View style={styles.passwordErrorContainer}>
              <Ionicons name="close" size={16} color={"red"} />

              <Text style={styles.passwordErrorText}>{error.password}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.dontAccount}>
          <Text style={styles.dontAccountText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signUpText}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  mainContainer: { flex: 1, marginHorizontal: 16 },

  signInImage: { width: "80%", height: "40%", alignSelf: "center" },

  loginText: { color: "white", fontSize: 28, fontFamily: "Raleway_700Bold" },

  signinContinue: {
    color: "#807D89",
    fontSize: 16,
    marginTop: 10,
    fontFamily: "Nunito_400Regular",
  },

  inputContainer: { marginTop: 20, gap: 15 },

  input: {
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    paddingVertical: 10,
    paddingLeft: 30,
    fontSize: 16,
    color: "#DDDCE2",
    fontFamily: "Nunito_400Regular",
  },

  emailIcon: { position: "absolute", top: 14 },

  eyeIcon: { position: "absolute", right: 0, top: 14 },

  checkedContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    marginLeft: -10,
    marginTop: 10,
  },

  checkedText: {
    color: "#DDDCE2",
    fontWeight: "100",
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
  },

  buttonContainer: {
    backgroundColor: "#DFB1CB",
    paddingVertical: 13,
    borderRadius: 15,
    marginTop: 20,
  },

  buttonContainer1: {
    backgroundColor: "#04012B",
    paddingVertical: 13,
    borderRadius: 15,
    marginTop: 20,
  },

  buttonText: {
    textAlign: "center",
    fontSize: 20,
    color: "black",
    fontFamily: "Raleway_700Bold",
  },

  buttonText1: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    color: "gray",
  },

  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  emailErrorContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: -25,
  },

  emailErrorText: {
    color: "red",
    fontFamily: "Nunito_400Regular",
  },

  passwordErrorContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 10,
  },

  passwordErrorText: { color: "red", fontFamily: "Nunito_400Regular" },

  forgotButtonContainer: { marginTop: 7 },

  forgotButtonText: {
    fontSize: 16,
    color: "#DDDCE2",
    fontFamily: "Nunito_400Regular",
  },

  dontAccount: { alignSelf: "center", flexDirection: "row", marginTop: 100 },

  dontAccountText: {
    color: "#DDDCE2",
    fontSize: 18,
    fontFamily: "Nunito_400Regular",
  },

  signUpText: {
    color: "#7568FF",
    marginLeft: 5,
    fontSize: 17,
    fontFamily: "Raleway_700Bold",
  },
});

export default SignIn;

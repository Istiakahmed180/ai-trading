import {
  View,
  Text,
  ToastAndroid,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import React from "react";
import {
  useFonts,
  Raleway_700Bold,
  Raleway_600SemiBold,
} from "@expo-google-fonts/raleway";
import { Nunito_400Regular } from "@expo-google-fonts/nunito";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthProvider";
import { useState } from "react";
import axios from "axios";
import { BaseURL } from "../../Shared/BaseURL/BaseURL";
import Loader from "../../Shared/Loader/Loader";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Fontisto, Ionicons, Octicons } from "@expo/vector-icons";
import Avatar from "../../../../assets/Avater.png";
import * as ImagePicker from "expo-image-picker";

const SignUp = ({ navigation }) => {
  const { isLoading, setIsLoading } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    reference: "",
    image: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
    image: "",
    custorError: "",
  });

  const uploadImageToImageBB = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "image.jpg",
      });

      const response = await axios.post(
        "https://api.imgbb.com/1/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            key: "995d95c9d759ae6e71fca323ad38d2ec",
          },
        }
      );

      if (response.data.status === 200) {
        const imageUrl = response.data.data.display_url;
        return imageUrl;
      } else {
        setError({ ...error, image: "Image upload failed" });
        return null;
      }
    } catch (error) {
      setError({ ...error, image: "Image upload failed" });
      return null;
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const imageUrl = await uploadImageToImageBB(imageUri);

      if (imageUrl) {
        setUserInfo({ ...userInfo, image: imageUrl });
      }
    }
  };

  const handleRegistration = async () => {
    if (userInfo.email && userInfo.password) {
      setIsLoading(true);
      const userInfoData = {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        password: userInfo.password,
        image: userInfo.image,
        totalBalance: 0,
        currentBalance: 0,
        withdrawalBalance: 0,
        role: "user",
        reference: userInfo.reference,
      };

      try {
        const response = await axios.post(
          `${BaseURL}/api/auth/register`,
          userInfoData
        );
        const data = await response.data;
        if (data?.message === "Register SuccessFull") {
          ToastAndroid.show(data?.message, ToastAndroid.SHORT);
          navigation.navigate("SignIn");
        } else {
          ToastAndroid.show(data?.message, ToastAndroid.SHORT);
        }
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    } else {
      ToastAndroid.show("Fill Up The All Required Field", ToastAndroid.SHORT);
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
      <ScrollView>
        <Text style={styles.accountText}>Create Your Account</Text>

        <Text style={styles.createAccountText}>
          Pleast enter info to create account
        </Text>

        <TouchableOpacity
          style={styles.reg_avatarContainer}
          onPress={pickImage}
        >
          {userInfo.image ? (
            <Image
              source={{ uri: userInfo.image }}
              style={styles.reg_avatarImage}
            />
          ) : (
            <Image source={Avatar} style={styles.reg_avatarImage} />
          )}
          {userInfo?.image ? null : (
            <Text style={styles.reg_uploadText}>Upload</Text>
          )}
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <View>
            <Feather
              style={styles.emailIcon}
              name="user"
              size={20}
              color={"#DDDCE2"}
            />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor={"#DDDCE2"}
              keyboardType="name-phone-pad"
              onChangeText={(value) =>
                setUserInfo({ ...userInfo, firstName: value })
              }
            />
          </View>
          <View>
            <Feather
              style={styles.emailIcon}
              name="user"
              size={20}
              color={"#DDDCE2"}
            />
            <TextInput
              style={styles.input}
              placeholder="Surname"
              placeholderTextColor={"#DDDCE2"}
              keyboardType="name-phone-pad"
              onChangeText={(value) =>
                setUserInfo({ ...userInfo, lastName: value })
              }
            />
          </View>
          <View>
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
            {error.email && (
              <View style={styles.emailErrorContainer}>
                <Ionicons name="close" size={16} color={"red"} />
                <Text style={styles.emailErrorText}>{error.email}</Text>
              </View>
            )}
          </View>
          <View>
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
            {error.password && (
              <View style={styles.passwordErrorContainer}>
                <Ionicons name="close" size={16} color={"red"} />
                <Text style={styles.passwordErrorText}>{error.password}</Text>
              </View>
            )}
          </View>
          <View>
            <Feather
              style={styles.emailIcon}
              name="user"
              size={20}
              color={"#DDDCE2"}
            />
            <TextInput
              style={styles.input}
              placeholder="Referance"
              placeholderTextColor={"#DDDCE2"}
              keyboardType="name-phone-pad"
              onChangeText={(value) =>
                setUserInfo({ ...userInfo, reference: value })
              }
            />
          </View>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleRegistration}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <View style={styles.haveAnAccount}>
            <Text style={styles.haveAnAccountText}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.signInText}>SIGN IN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  accountText: {
    color: "white",
    fontSize: 28,
    marginTop: 30,
    textAlign: "center",
    fontFamily: "Raleway_700Bold",
  },

  createAccountText: {
    color: "#807D89",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },

  reg_avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 100,
    overflow: "hidden",
    alignSelf: "center",
    marginBottom: 10,
    backgroundColor: "#350a75",
    marginTop: 30,
  },

  reg_avatarImage: {
    width: "100%",
    height: "100%",
  },

  reg_uploadText: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "white",
    fontSize: 15,
    paddingBottom: 2,
    fontFamily: "Nunito_400Regular",
  },

  inputContainer: { marginTop: 20, gap: 20, marginHorizontal: 16 },

  emailIcon: { position: "absolute", top: 14 },

  input: {
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    paddingVertical: 10,
    paddingLeft: 30,
    fontSize: 16,
    color: "#DDDCE2",
    fontFamily: "Nunito_400Regular",
  },

  eyeIcon: { position: "absolute", right: 0, top: 14 },

  buttonContainer: {
    backgroundColor: "#DFB1CB",
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
    bottom: -25,
  },

  passwordErrorText: {
    color: "red",
    fontFamily: "Nunito_400Regular",
  },

  haveAnAccount: { alignSelf: "center", flexDirection: "row", marginTop: 70 },

  haveAnAccountText: {
    color: "#DDDCE2",
    fontSize: 18,
    fontFamily: "Nunito_400Regular",
  },

  signInText: {
    color: "#7568FF",
    marginLeft: 5,
    fontSize: 17,
    fontFamily: "Raleway_700Bold",
  },
});

export default SignUp;

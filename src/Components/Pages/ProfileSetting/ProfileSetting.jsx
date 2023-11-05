import {
  View,
  Text,
  ToastAndroid,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthProvider";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { BaseURL } from "../../Shared/BaseURL/BaseURL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const ProfileSetting = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [userGender, setUserGender] = useState("");
  const [image, setImage] = useState(null);
  const [userInfo, setUserInfo] = useState({
    userFirstName: "",
    userLastName: "",
    userEmail: "",
    userPhone: "",
    userAddress: "",
    userBio: "",
    userImage: image,
  });

  const handleUploadImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to upload an image.");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleClientData = () => {
    if (
      userInfo.userFirstName === "" ||
      userInfo.userLastName === "" ||
      userInfo.userEmail === "" ||
      userInfo.userPhone === "" ||
      userInfo.userAddress === "" ||
      userInfo.userBio === "" ||
      userGender === "" ||
      image === null
    ) {
      ToastAndroid.show(
        "Please fill in all fields before updating the profile.",
        ToastAndroid.LONG
      );
      return;
    }

    const updateProfile = {
      firstName: userInfo.userFirstName,
      lastName: userInfo.userLastName,
      email: userInfo.userEmail,
      image: image,
      phone: userInfo.userPhone,
      gender: userGender,
      address: userInfo.userAddress,
      bio: userInfo.userBio,
    };

    axios
      .put(`${BaseURL}/api/auth/update-profile/${user?._id}`, updateProfile)
      .then((res) => {
        if (res?.data) {
          ToastAndroid.show(res.data.message, ToastAndroid.LONG);
          navigation.navigate("Login");
          AsyncStorage.removeItem("accessToken");
        }
      })
      .catch((err) => {});
  };

  return (
    <ScrollView>
      <SafeAreaView
        style={{ backgroundColor: "#05003B", padding: 20, flex: 1 }}
      >
        <View
          style={{
            backgroundColor: "#19216C",
            padding: 15,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
            Account Information
          </Text>
        </View>
        <View
          style={{ borderWidth: 1, borderColor: "#36325F", marginTop: 10 }}
        />

        <View style={{ marginTop: 10 }}>
          <Text
            style={{
              marginBottom: 5,
              fontSize: 16,
              fontWeight: "bold",
              color: "white",
            }}
          >
            First Name
          </Text>
          <TextInput
            onChangeText={(value) =>
              setUserInfo({ ...userInfo, userFirstName: value })
            }
            style={{
              padding: 10,
              backgroundColor: "#140F47",
              borderColor: "#36325F",
              borderWidth: 1,
              borderRadius: 5,
              color: "white",
            }}
            placeholder="Enter Your First Name"
            placeholderTextColor={"gray"}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <Text
            style={{
              marginBottom: 5,
              fontSize: 16,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Last Name
          </Text>
          <TextInput
            onChangeText={(value) =>
              setUserInfo({ ...userInfo, userLastName: value })
            }
            placeholder="Enter Your Last Name"
            placeholderTextColor={"gray"}
            style={{
              padding: 10,
              backgroundColor: "#140F47",
              borderColor: "#36325F",
              borderWidth: 1,
              borderRadius: 5,
              color: "white",
            }}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <Text
            style={{
              marginBottom: 5,
              fontSize: 16,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Email Address
          </Text>
          <TextInput
            onChangeText={(value) =>
              setUserInfo({ ...userInfo, userEmail: value })
            }
            placeholder="Enter Your Email"
            placeholderTextColor={"gray"}
            style={{
              padding: 10,
              backgroundColor: "#140F47",
              borderColor: "#36325F",
              borderWidth: 1,
              borderRadius: 5,
              color: "white",
            }}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <Text
            style={{
              marginBottom: 5,
              fontSize: 16,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Phone Number
          </Text>
          <TextInput
            placeholder="Enter Your Phone Number"
            placeholderTextColor={"gray"}
            style={{
              padding: 10,
              backgroundColor: "#140F47",
              borderColor: "#36325F",
              borderWidth: 1,
              borderRadius: 5,
              color: "white",
            }}
            keyboardType="numeric"
            onChangeText={(value) =>
              setUserInfo({ ...userInfo, userPhone: value })
            }
          />
        </View>
        <View style={{ marginTop: 5 }}>
          <Text
            style={{
              marginBottom: 2,
              fontSize: 18,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Gender
          </Text>
          <Picker
            selectedValue={userGender}
            onValueChange={(itemValue) => setUserGender(itemValue)}
            style={{
              padding: 8,
              fontSize: 18,
              backgroundColor: "#140F47",
              borderColor: "#36325F",
              borderRadius: 8,
              color: "white",
            }}
          >
            <Picker.Item label="Choose Your Gender" value="" enabled={false} />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text
            style={{
              marginBottom: 5,
              fontSize: 16,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Address
          </Text>
          <TextInput
            onChangeText={(value) =>
              setUserInfo({ ...userInfo, userAddress: value })
            }
            placeholder="Enter Your Address"
            placeholderTextColor={"gray"}
            style={{
              padding: 10,
              backgroundColor: "#140F47",
              borderColor: "#36325F",
              borderWidth: 1,
              borderRadius: 5,
              color: "white",
            }}
          />
        </View>
        <View style={{ marginTop: 5 }}>
          <Text
            style={{
              marginBottom: 2,
              fontSize: 20,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Bio
          </Text>
          <TextInput
            onChangeText={(value) =>
              setUserInfo({ ...userInfo, userBio: value })
            }
            multiline
            numberOfLines={4}
            style={{
              width: "100%",
              padding: 10,
              fontSize: 15,
              backgroundColor: "#140F47",
              borderWidth: 1,
              borderColor: "#36325F",
              borderRadius: 10,
              color: "white",
            }}
            placeholder="Write About Yourself"
            placeholderTextColor={"gray"}
          />
        </View>
        <View style={{ marginTop: 5 }}>
          <Text
            style={{
              marginBottom: 2,
              fontSize: 20,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Upload Image
          </Text>
          <TouchableOpacity onPress={handleUploadImage}>
            <View
              style={{
                width: "100%",
                padding: 2.5,
                backgroundColor: "#140F47",
                borderWidth: 1,
                borderColor: "#36325F",
                borderRadius: 10,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 20, textAlign: "center" }}
              >
                Select Image
              </Text>
            </View>
          </TouchableOpacity>
          {image && (
            <Image
              source={{ uri: image }}
              style={{
                width: 80,
                height: 80,
                marginTop: 10,
                borderRadius: 10,
                alignSelf: "center",
              }}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={handleClientData}
          style={{
            backgroundColor: "linear-gradient(45deg, #8A2BE2, #3498db)",
            borderRadius: 10,
            paddingVertical: 15,
            paddingHorizontal: 30,
            alignItems: "center",
            marginTop: 30,
            shadowColor: "rgba(0, 0, 0, 0.5)",
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 3,
            marginHorizontal: 95,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
            Update Profile
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ProfileSetting;

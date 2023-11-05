import { View, Text, ImageBackground, SafeAreaView } from "react-native";
import React from "react";
import Header from "../../../Shared/Header/Header";

const AdminSettings = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("../../../../../assets/Body-Background.jpg")}
      style={{
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header Section */}
          <Header navigation={navigation} />

          {/* Body Section */}
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white" }}>Admin Settings</Text>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

export default AdminSettings;

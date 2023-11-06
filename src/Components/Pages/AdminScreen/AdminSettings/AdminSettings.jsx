import { View, Text, ImageBackground, SafeAreaView } from "react-native";
import React from "react";
import Header from "../../../Shared/Header/Header";

const AdminSettings = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <View style={{ flex: 1, backgroundColor: "#464755" }}>
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
            <Text style={{ color: "white" }}>Coming Soon</Text>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

export default AdminSettings;

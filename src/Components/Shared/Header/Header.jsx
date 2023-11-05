import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../../../Context/AuthProvider";

const Header = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  return (
    <View
      style={{
        backgroundColor: "#1F1E2E",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderBottomColor: "gray",
      }}
    >
      <Text style={{ fontSize: 18, color: "white", fontWeight: "bold" }}>
        {user?.firstName + " " + user?.lastName}
      </Text>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <ImageBackground
          source={require("../../../../assets/menu_10471277.png")}
          style={{ width: 25, height: 25 }}
        ></ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

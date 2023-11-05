import { View, Text, ImageBackground, Image } from "react-native";
import React, { useContext } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthContext } from "../Context/AuthProvider";

const CustomDrawer = (props) => {
  const { logout, user } = useContext(AuthContext);
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: "#1E3A8A" }}
      >
        <ImageBackground
          source={require("../../assets/Menu_BG_Image.jpg")}
          style={{ padding: 30 }}
        >
          {user?.image ? (
            <Image
              source={{ uri: `${user?.image}` }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                marginRight: 15,
              }}
            />
          ) : (
            <Image
              source={{
                uri: "https://img.freepik.com/premium-vector/handsome-businessman-suit_88465-811.jpg?w=740",
              }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                marginRight: 15,
              }}
            />
          )}

          {user?.role === "user" && (
            <Text style={{ color: "white", fontSize: 18 }}>
              Current Balance: ${user.currentBalance}
            </Text>
          )}
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: "white", paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }}>
        <TouchableOpacity
          onPress={() => {
            logout();
          }}
          style={{ paddingVertical: 15 }}
        >
          <View style={{ flexDirection: "row" }}>
            <Image
              source={require("../../assets/log-out_3596144.png")}
              style={{ width: 20, height: 20 }}
            />
            <Text style={{ fontSize: 15, marginLeft: 5 }}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;

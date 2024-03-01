import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { AuthContext } from "../../../Context/AuthProvider";

const Header = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {user?.firstName} {user?.lastName}
      </Text>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Image
          source={require("../../../../assets/menu_10471277.png")}
          style={styles.menuIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: "3%",
    borderBottomWidth: 0.5,
    borderBottomColor: "grey",
    marginHorizontal: "5%",
  },
  title: {
    fontSize: Dimensions.get("window").width * 0.04,
    color: "#91909A",
    fontWeight: "bold",
  },
  menuIcon: {
    width: 25,
    height: 25,
  },
});

export default Header;

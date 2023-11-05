import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../../../Context/AuthProvider";
import Icon from "react-native-vector-icons/FontAwesome";

const Profile = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#05003B" }}>
      <View style={{ flex: 1, backgroundColor: "#05003B", padding: 16 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#140F47",
            borderRadius: 20,
            padding: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
              Profile Information
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile Setting")}
            >
              <Icon name="edit" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#36325F",
              marginBottom: 12,
            }}
          />

          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              {/* Profile Image */}
              <View
                style={{
                  overflow: "hidden",
                  height: 160,
                  width: 160,
                }}
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
              </View>

              <View style={{ marginTop: 20 }}>
                {/* Name */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, color: "white" }}>Name: </Text>
                  <Text
                    style={{ fontSize: 16, color: "white", fontWeight: "bold" }}
                  >{`${user.firstName} ${user.lastName}`}</Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#36325F",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />

                {/* Email */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, color: "white" }}>
                    Email Address:{" "}
                  </Text>
                  <Text
                    style={{ fontSize: 16, color: "white", fontWeight: "bold" }}
                  >
                    {user.email}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#36325F",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />

                {/* Phone Number */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, color: "white" }}>
                    Phone Number:{" "}
                  </Text>
                  <Text
                    style={{ fontSize: 16, color: "white", fontWeight: "bold" }}
                  >
                    {user.phone ? user.phone : "No Information"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#36325F",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />

                {/* Gender */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, color: "white" }}>Gender: </Text>
                  <Text
                    style={{ fontSize: 16, color: "white", fontWeight: "bold" }}
                  >
                    {user.gender ? user.gender : "No Information"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#36325F",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />

                {/* Address */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, color: "white" }}>
                    Address:{" "}
                  </Text>
                  <Text
                    style={{ fontSize: 16, color: "white", fontWeight: "bold" }}
                  >
                    {user.address ? user.address : "No Information"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flex: 1, paddingLeft: 20 }}>
              {/* About Me */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    marginBottom: 10,
                    color: "white",
                  }}
                >
                  About Me
                </Text>
              </View>
              <Text style={{ fontSize: 16, color: "white" }}>
                {user.bio ? user.bio : "No Information"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

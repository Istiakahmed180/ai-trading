import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  TouchableHighlight,
  RefreshControl,
  Modal,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Context/AuthProvider";
import axios from "axios";
import { BaseURL } from "../../../Shared/BaseURL/BaseURL";
import Header from "../../../Shared/Header/Header";
import EyeIcon from "@expo/vector-icons/Feather";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";

const UserReceiveMoney = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [userHistoryData, setUserHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkModal, setCheckModal] = useState(false);
  const [checkModalData, setCheckModalData] = useState({});

  const handleRefreshing = async () => {
    setLoading(true);
    try {
      const getUserSendHistory = await axios.get(
        `${BaseURL}/api/received/get-user-receive-history?email=${user?.email}`
      );
      const data = await getUserSendHistory.data;

      setUserHistoryData(data?.data);
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    handleRefreshing();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1C1C2E" }}>
      {/* Header Section */}
      <Header navigation={navigation} />

      {/* Body Section */}
      <View>
        <View
          style={{
            backgroundColor: "#1E3A8A",
            padding: 15,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginHorizontal: 10,
            marginTop: 15,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              textAlign: "center",
              fontWeight: "700",
            }}
          >
            Receive Money
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
            size="large"
            color="#1E3A8A"
          />
        ) : (
          <FlatList
            data={userHistoryData}
            keyExtractor={(item) => item?._id}
            renderItem={({ item }) => {
              return (
                <View
                  key={item?._id}
                  style={{
                    padding: 20,
                    backgroundColor: "#3C4151",
                    borderRadius: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    elevation: 3,
                    marginHorizontal: 10,
                    marginTop: 15,
                  }}
                >
                  <View style={{ marginBottom: 10 }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        marginBottom: 5,
                        color: "#BBBCC3",
                        fontSize: 16,
                      }}
                    >
                      Sender Name: {item?.senderName}
                    </Text>
                    <Text style={{ color: "#BBBCC3", fontWeight: 700 }}>
                      Sender Email: {item?.senderEmail}
                    </Text>
                    <Text
                      style={{
                        color: "#BBBCC3",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      Receive Money:{" "}
                      <Text style={{ color: "#FFA500" }}>
                        ${item?.receiveAmount}
                      </Text>
                    </Text>
                  </View>
                  <TouchableHighlight
                    onPress={() => {
                      setCheckModalData(item);
                      setCheckModal(true);
                    }}
                    style={{
                      padding: 10,
                      borderRadius: 5,
                      alignItems: "center",
                    }}
                  >
                    <EyeIcon name="eye" size={25} color={"#388DEC"} />
                  </TouchableHighlight>
                </View>
              );
            }}
            // ListEmptyComponent should return JSX elements
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                    marginTop: 40,
                    color: "red",
                    fontWeight: "bold",
                  }}
                >
                  Receive Money Information Not Available
                </Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 155 }}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={handleRefreshing}
                colors={["#1E3A8A"]}
              />
            }
          />
        )}
      </View>

      {/* Check Sendign Data */}
      <Modal transparent={true} animationType="slide" visible={checkModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              padding: 20,
              backgroundColor: "#505562",
              borderRadius: 10,
              elevation: 5,
              width: "80%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "#B4B4BC" }}
              >
                Recieve Money Information
              </Text>
              <Icon
                onPress={() => setCheckModal(false)}
                name="close-circle-outline"
                size={30}
                color="#FFA500"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 15,
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
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    marginBottom: 5,
                    color: "#B4B4BC",
                    fontWeight: "700",
                  }}
                >
                  From: {checkModalData?.senderEmail}
                </Text>
                <Text
                  style={{
                    marginBottom: 5,
                    color: "#B4B4BC",
                    fontWeight: "700",
                  }}
                >
                  To: {checkModalData?.email}
                </Text>
                <Text
                  style={{
                    marginBottom: 5,
                    color: "#B4B4BC",
                    fontWeight: "700",
                  }}
                >
                  Sender Name: {checkModalData?.senderName}
                </Text>
                <Text
                  style={{
                    marginBottom: 5,
                    color: "#B4B4BC",
                    fontWeight: "700",
                  }}
                >
                  Receiving Date:{" "}
                  {moment(checkModalData?.receiveDateAndTime).format("DD MMM")}
                </Text>
                <Text
                  style={{
                    marginBottom: 5,
                    color: "#B4B4BC",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  Receiving Amount:{" "}
                  <Text style={{ color: "#FFA500" }}>
                    ${checkModalData?.receiveAmount}
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserReceiveMoney;

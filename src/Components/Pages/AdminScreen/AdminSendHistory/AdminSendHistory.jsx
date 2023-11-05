import {
  View,
  Text,
  ToastAndroid,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Context/AuthProvider";
import axios from "axios";
import { BaseURL } from "../../../Shared/BaseURL/BaseURL";
import Header from "../../../Shared/Header/Header";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";

const AdminSendHistory = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [sendignData, setSendingData] = useState([]);
  const [modal, setModal] = useState(false);
  const [checkData, setCheckData] = useState({});

  const handleDeleteData = async (id) => {
    try {
      const deletingData = await axios.delete(
        `${BaseURL}/api/send/delete-send-history/${id}`
      );
      const data = await deletingData.data;
      const filter = sendignData?.filter((data) => data?._id !== id);
      setSendingData(filter);

      ToastAndroid.show(data?.message, ToastAndroid.LONG);
    } catch (error) {}
  };

  const handleRefreshing = async () => {
    setLoading(true);
    try {
      const getAllSendingHistory = await axios.get(
        `${BaseURL}/api/send/all-send-history`
      );
      const data = getAllSendingHistory.data;
      setSendingData(data?.data);
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    handleRefreshing();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#585966" }}>
      {/* Header Section */}
      <Header navigation={navigation} />

      {/* Body Section */}
      <View
        style={{
          backgroundColor: "#585966",
          borderRadius: 20,
          margin: 10,
          elevation: 3,
          flex: 1,
        }}
      >
        <View
          style={{
            backgroundColor: "#1E3A8A",
            padding: 15,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
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
            Send Money Transaction
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
            color="orange"
          />
        ) : (
          <FlatList
            data={sendignData}
            keyExtractor={(item) => item?._id}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    padding: 20,
                    backgroundColor: "#6F7680",
                    borderRadius: 8,
                    shadowColor: "$000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    marginTop: 10,
                    marginHorizontal: 10,
                  }}
                >
                  <View style={{ marginBottom: 10 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        marginBottom: 5,
                        color: "#B5B5B5",
                        fontWeight: "700",
                      }}
                    >
                      Sender Name: {item?.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        marginBottom: 5,
                        color: "#B0B0B8",
                      }}
                    >
                      Sender Email: {item?.email}
                    </Text>
                  </View>
                  <View style={{ marginBottom: 10 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        marginBottom: 5,
                        color: "#B0B0B8",
                      }}
                    >
                      Receiver Name: {item?.recevierName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        marginBottom: 5,
                        color: "#B0B0B8",
                      }}
                    >
                      Receiver Email: {item?.receiverEmail}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 15,
                      color: "#fff",
                    }}
                  >
                    Sending Amount : ${item?.sendAmount}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setModal(true);
                      setCheckData(item);
                    }}
                    style={{
                      backgroundColor: "#3498db",
                      padding: 10,
                      borderRadius: 5,
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>Check</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteData(item?._id)}
                    style={{
                      backgroundColor: "#D94C42",
                      padding: 10,
                      borderRadius: 5,
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            ListEmptyComponent={() => {
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
                  Sending History Not Available
                </Text>
              </View>;
            }}
            contentContainerStyle={{ paddingBottom: 15 }}
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
      <Modal animationType="fade" transparent={true} visible={modal}>
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
              backgroundColor: "#6F7680",
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
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
                Send Money History
              </Text>
              <Icon
                onPress={() => setModal(false)}
                name="close-circle-outline"
                size={30}
                color="orange"
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
                <Text style={{ marginBottom: 5, color: "#E9E9E9" }}>
                  From: {checkData && checkData?.email}
                </Text>
                <Text style={{ marginBottom: 5, color: "#E9E9E9" }}>
                  To: {checkData && checkData?.receiverEmail}
                </Text>
                <Text style={{ marginBottom: 5, color: "#E9E9E9" }}>
                  Receiver Name: {checkData && checkData?.recevierName}
                </Text>
                <Text style={{ marginBottom: 5, color: "#E9E9E9" }}>
                  Sending Date:
                  {checkData &&
                    moment(checkData?.sendingDateAndTime).format("DD MMM")}
                </Text>
                <Text
                  style={{ marginBottom: 5, color: "#fff", fontWeight: "700" }}
                >
                  Sending Amount: ${checkData && checkData?.sendAmount}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AdminSendHistory;

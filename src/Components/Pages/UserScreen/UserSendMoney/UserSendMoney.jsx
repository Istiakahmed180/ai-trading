import {
  View,
  Text,
  ToastAndroid,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  TouchableHighlight,
  RefreshControl,
  Modal,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Context/AuthProvider";
import axios from "axios";
import { BaseURL } from "../../../Shared/BaseURL/BaseURL";
import Header from "../../../Shared/Header/Header";
import EyeIcon from "@expo/vector-icons/Feather";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";

const UserSendMoney = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(null);
  const [userHistoryData, setUserHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkModal, setCheckModal] = useState(false);
  const [checkModalData, setCheckModalData] = useState({});

  const handleSendMoney = async () => {
    const sendAmount = {
      senderEmail: user?.email,
      recipientEmail: email,
      amount: parseFloat(amount),
    };

    try {
      const fetchingData = await axios.post(
        `${BaseURL}/api/invest/transfer-amount`,
        sendAmount
      );
      const data = await fetchingData.data;

      if (data?.type === true) {
        ToastAndroid.show(data?.message, ToastAndroid.LONG);
        setModal(false);
        setLoading(false);

        const senderHistoryData = {
          name: data?.sender?.firstName + " " + data?.sender?.lastName,
          recevierName:
            data?.recipient?.firstName + " " + data?.recipient?.lastName,
          email: data?.sender?.email,
          receiverEmail: data?.recipient?.email,
          image: data?.sender?.image,
          receiverImage: data?.recipient?.image,
          totalBalance: parseFloat(data?.sender?.totalBalance),
          currentBalance: parseFloat(data?.sender?.currentBalance),
          sendAmount: parseFloat(data?.sender?.sendAmount),
        };
        await handelSendingHistoryData(senderHistoryData);

        const receiverHistoryData = {
          name: data?.recipient?.firstName + " " + data?.recipient?.lastName,
          senderName: data?.sender?.firstName + " " + data?.sender?.lastName,
          email: data?.recipient?.email,
          senderEmail: data?.sender?.email,
          image: data?.recipient?.image,
          senderImage: data?.sender?.image,
          totalBalance: parseFloat(data?.recipient?.totalBalance),
          currentBalance: parseFloat(data?.recipient?.currentBalance),
          receiveAmount: parseFloat(data?.recipient?.receiveAmount),
        };
        await handleReceivingHistoryData(receiverHistoryData);
      } else {
        ToastAndroid.show(data?.message, ToastAndroid.LONG);
      }
    } catch (e) {}
  };

  const handelSendingHistoryData = async (senderHistoryData) => {
    try {
      const fetcingSendingHistory = await axios.post(
        `${BaseURL}/api/send/add-send-history`,
        senderHistoryData
      );
      const data = await fetcingSendingHistory.data;
    } catch (error) {}
  };

  const handleReceivingHistoryData = async (receiverHistoryData) => {
    try {
      const fetchingReceivingHistory = await axios.post(
        `${BaseURL}/api/received/add-receive-data`,
        receiverHistoryData
      );
      const data = await fetchingReceivingHistory.data;
    } catch (error) {}
  };

  const handleRefreshing = async () => {
    setLoading(true);
    try {
      const getUserSendHistory = await axios.get(
        `${BaseURL}/api/send/get-user-send-history?email=${user?.email}`
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
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <Header navigation={navigation} />

      {/* Body Section */}
      <View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 25, color: "#AFAEB5", fontWeight: "500" }}>
            Send Money{" "}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#3C58FA",
              padding: 10,
              borderRadius: 10,
              marginTop: 20,
            }}
            onPress={() => setModal(true)}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: "white",
                fontSize: 15,
                textAlign: "center",
              }}
            >
              Send Money
            </Text>
          </TouchableOpacity>
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
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#272A3D",
                    padding: 16,
                    borderRadius: 8,
                    elevation: 3,
                    marginTop: 10,
                    marginHorizontal: 10,
                  }}
                >
                  <View style={{ marginBottom: 10 }}>
                    <Text
                      style={{
                        marginBottom: 5,
                        color: "#B4B4BC",
                        fontSize: 16,
                      }}
                    >
                      Receiver Name: {item?.recevierName}
                    </Text>
                    <Text style={{ color: "#B4B4BC" }}>
                      Receiver Email: {item?.receiverEmail}
                    </Text>
                    <Text
                      style={{
                        color: "#B4B4BC",
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      Sending Money:{" "}
                      <Text style={{ color: "#FEAE1A" }}>
                        ${item?.sendAmount}
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
                    <EyeIcon name="eye" size={25} color={"#2C7FD9"} />
                  </TouchableHighlight>
                </View>
              );
            }}
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
                  Send Money Information Not Available
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

      {/* Send Money Submit Modal */}
      <Modal animationType="fade" transparent={true} visible={modal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "#B3B3B9" }}
              >
                Send Money
              </Text>
              <Icon
                onPress={() => setModal(false)}
                name="close-circle-outline"
                size={30}
                color="#EB9D24"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                keyboardType="email-address"
                placeholder="Receiver Email"
                onChangeText={(value) => setEmail(value)}
                placeholderTextColor={"#9EA0A6"}
              />
              <TextInput
                placeholder="Amount"
                style={styles.input}
                keyboardType="numeric"
                onChangeText={(value) => setAmount(value)}
                placeholderTextColor={"#9EA0A6"}
              />
              <View style={styles.submitButtonContainer}>
                <TouchableHighlight
                  style={styles.submitButton}
                  onPress={handleSendMoney}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
              backgroundColor: "#323343",
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
                style={{ fontSize: 18, fontWeight: "bold", color: "#FFFFFF" }}
              >
                Send Money History
              </Text>
              <Icon
                onPress={() => setCheckModal(false)}
                name="close-circle-outline"
                size={30}
                color="#FCB533"
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
                    color: "#AFAEB5",
                    fontWeight: "700",
                  }}
                >
                  From: {checkModalData?.email}
                </Text>
                <Text
                  style={{
                    marginBottom: 5,
                    color: "#AFAEB5",
                    fontWeight: "700",
                  }}
                >
                  To: {checkModalData?.receiverEmail}
                </Text>
                <Text
                  style={{
                    marginBottom: 5,
                    color: "#AFAEB5",
                    fontWeight: "700",
                  }}
                >
                  Receiver Name: {checkModalData?.recevierName}
                </Text>
                <Text
                  style={{
                    marginBottom: 5,
                    color: "#AFAEB5",
                    fontWeight: "700",
                  }}
                >
                  Sending Date: {moment(checkModalData?.date).format("DD MMM")}
                </Text>
                <Text
                  style={{
                    marginBottom: 5,
                    color: "#AFAEB5",
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  Sending Amount: ${checkModalData?.sendAmount}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    backgroundColor: "#323343",
    borderRadius: 10,
    padding: 20,
    width: "90%",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  inputContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#9EA0A6",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: "white",
  },

  submitButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "40%",
  },

  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    paddingHorizontal: 20,
    fontSize: 15,
  },

  submitButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  container: { backgroundColor: "#1F1E2E", flex: 1 },
});

export default UserSendMoney;

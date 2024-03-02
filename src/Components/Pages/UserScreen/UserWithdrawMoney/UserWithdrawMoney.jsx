import {
  View,
  Text,
  ToastAndroid,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Modal,
  TextInput,
  TouchableHighlight,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Context/AuthProvider";
import axios from "axios";
import { BaseURL } from "../../../Shared/BaseURL/BaseURL";
import Header from "../../../Shared/Header/Header";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";

const UserWithdrawMoney = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [modal, setModal] = useState(false);
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [withdrawData, setWithdrawData] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [viewModalData, setViewModalData] = useState({});

  const handleWithdrawRequest = () => {
    const userInfo = {
      name: user?.firstName + " " + user?.lastName,
      email: user?.email,
      phone: user?.phone,
      address: user?.address,
      gender: user?.gender,
      bio: user?.bio,
      amount: parseFloat(amount),
      image: user?.image,
    };
    sendWithdrawRequest(userInfo);
  };

  const sendWithdrawRequest = async (userInfo) => {
    try {
      const saveWithdrawRequest = await axios.post(
        `${BaseURL}/api/withdraw/add-withdraw-request`,
        userInfo
      );
      const data = await saveWithdrawRequest.data;
      if (data?.type === true) {
        ToastAndroid.show(data?.message, ToastAndroid.LONG);
        setModal(false);
      } else {
        return ToastAndroid.show(data?.message, ToastAndroid.LONG);
      }
    } catch (error) {}
  };

  const handleRefreshing = async () => {
    setLoading(true);
    try {
      const userWithdrawHistory = await axios.get(
        `${BaseURL}/api/withdraw/get-user-withdraw-history?email=${user?.email}`
      );
      const data = await userWithdrawHistory.data;
      setWithdrawData(data?.data);
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    handleRefreshing();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#323343" }}>
      {/* Header Section */}
      <Header navigation={navigation} />

      {/* Body Section */}
      <View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => setModal(true)}
            style={{
              backgroundColor: "#3C58FA",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: "white",
                fontSize: 15,
                textAlign: "center",
              }}
            >
              Withdraw Money
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: "#1E3A8A",
            padding: 15,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginTop: 10,
            marginHorizontal: 10,
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
            Wtidhtraw Money Transaction
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color="#1E3A8A"
          />
        ) : (
          <FlatList
            data={withdrawData}
            keyExtractor={(item) => item?._id}
            renderItem={({ item }) => {
              return (
                <View style={styles.container}>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.name}>{item?.name}</Text>
                    <Text style={styles.date}>
                      {moment(item?.date).format("DD MMM")}
                    </Text>
                    <Text style={styles.transaction}>
                      You Got Money:{" "}
                      <Text style={{ color: "orange" }}>${item?.amount}</Text>
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => {
                      setViewModal(true);
                      setViewModalData(item);
                    }}
                  >
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            ListEmptyComponent={() => {
              <View style={styles.information_container}>
                <Text style={styles.information_text}>
                  Withdraw Information Not Available
                </Text>
              </View>;
            }}
            contentContainerStyle={{ marginBottom: 100 }}
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
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#616672",
              borderRadius: 10,
              padding: 20,
              width: "90%",
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
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
              >
                Withdraw Money
              </Text>
              <Icon
                onPress={() => setModal(false)}
                name="close-circle-outline"
                size={30}
                color="#D6A05C"
              />
            </View>
            <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  padding: 10,
                  marginBottom: 10,
                }}
                keyboardType="email-address"
                placeholder={user.email}
                editable={false}
                placeholderTextColor={"#A9ABAF"}
              />
              <TextInput
                placeholder="Amount"
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  padding: 10,
                  marginBottom: 10,
                  color: "white",
                }}
                keyboardType="numeric"
                placeholderTextColor={"#A9ABAF"}
                onChangeText={(value) => setAmount(value)}
              />
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableHighlight
                  onPress={handleWithdrawRequest}
                  style={{
                    backgroundColor: "blue",
                    borderRadius: 5,
                    alignItems: "center",
                    paddingVertical: "4%",
                    paddingHorizontal: "5%",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "500",
                      fontSize: Dimensions.get("window").width * 0.045,
                    }}
                  >
                    Submit
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* View Detais Modal */}
      <Modal animationType="slide" transparent={true} visible={viewModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>
                Withdraw Transaction Details
              </Text>
              <Icon
                onPress={() => setViewModal(false)}
                name="close-circle-outline"
                size={30}
                color="orange"
              />
            </View>
            <View style={styles.userInfoContainer}>
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
              <Text style={styles.userEmail}>Email: {viewModalData.email}</Text>
            </View>
            <View style={styles.transactionInfoContainer}>
              <Text style={{ color: "#BABBBC", fontWeight: "700" }}>
                You Got Money:{" "}
                <Text style={{ color: "orange", fontWeight: "bold" }}>
                  ${viewModalData.amount}
                </Text>
              </Text>
              <Text style={{ color: "#BABBBC", fontWeight: "700" }}>
                Vat:{" "}
                <Text style={{ color: "orange", fontWeight: "bold" }}>
                  ${parseFloat(viewModalData.deductionPercentAmount).toFixed(2)}
                </Text>
              </Text>
              <Text style={{ color: "#BABBBC", fontWeight: "700" }}>
                Withdraw Transaction:{" "}
                <Text style={{ color: "orange" }}>
                  ${viewModalData.withdrawAmount}
                </Text>
              </Text>
              <Text style={{ color: "#BABBBC", fontWeight: "700" }}>
                Total Transaction:{" "}
                <Text style={{ color: "orange" }}>${user.totalBalance}</Text>
              </Text>
              <Text style={{ color: "#BABBBC", fontWeight: "700" }}>
                Current Transaction:{" "}
                <Text style={{ color: "orange" }}>${user.currentBalance}</Text>
              </Text>
              <Text style={{ color: "#BABBBC", fontWeight: "700" }}>
                Date: {moment(viewModalData.date).format("DD MMM")}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#505562",
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 10,
  },
  transactionInfo: {},
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#BBBCC3",
  },
  date: {
    color: "#9B9BA4",
    fontWeight: "700",
  },
  transaction: {
    marginTop: 5,
    color: "#9B9BA4",
    fontSize: 16,
    fontWeight: "bold",
  },
  viewButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 3,
    width: "25%",
    alignSelf: "center",
  },
  viewButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  information_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  information_text: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 40,
    color: "red",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#6F7680",
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
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userEmail: {
    fontSize: 16,
    color: "#BABBBC",
    fontWeight: "700",
  },
  transactionInfoContainer: {
    marginBottom: 15,
  },
});

export default UserWithdrawMoney;

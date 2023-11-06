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
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Context/AuthProvider";
import axios from "axios";
import { BaseURL } from "../../../Shared/BaseURL/BaseURL";
import Header from "../../../Shared/Header/Header";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";

const UserDeposit = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [modal, setModal] = useState(false);
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [depositData, setDepositData] = useState([]);

  const handleWithdrawDeposit = async (id) => {
    try {
      const withdrawAmount = await axios.put(
        `${BaseURL}/api/deposit/withdraw-deposit-money?id=${id}`
      );

      const data = await withdrawAmount.data;
      if (data?.type === true) {
        ToastAndroid.show(data?.message, ToastAndroid.LONG);
      } else {
        ToastAndroid.show(data?.message, ToastAndroid.LONG);
      }
    } catch (error) {}
  };

  const handelDeposit = () => {
    const userData = {
      name: user?.firstName + " " + user?.lastName,
      email: user?.email,
      image: user?.image,
      phone: user?.phone,
      address: user?.address,
      gender: user?.gender,
      amount: parseFloat(amount),
      bio: user?.bio,
      depositTotalBalance: 0,
      depositCurrentBalance: 0,
    };
    sendingDepositData(userData);
  };

  const sendingDepositData = async (userData) => {
    try {
      const sendData = await axios.post(
        `${BaseURL}/api/deposit/add-deposit-transaction`,
        userData
      );
      const data = await sendData.data;

      if (data.type === true) {
        ToastAndroid.show(data?.message, ToastAndroid.LONG);
        setModal(false);
      } else {
        ToastAndroid.show(data?.message, ToastAndroid.LONG);
      }
    } catch (err) {}
  };

  const handleRefreshing = async () => {
    setLoading(true);
    try {
      const userDepositData = await axios.get(
        `${BaseURL}/api/deposit/get-deposit-transaction?email=${user?.email}`
      );
      const data = await userDepositData.data;
      setDepositData(data?.data);
    } catch (err) {}
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
              Deposit Money
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
            Deposit Money Transaction
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
            data={depositData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              const formatedDate = moment(item?.withdrawDate).format(
                "YYYY-MM-DD"
              );
              const currentDate = moment();
              const isBeforeCurrentDate =
                moment(formatedDate).isBefore(currentDate);

              return (
                <View style={styles.container}>
                  <View>
                    {item.depositAmount ? (
                      <Text
                        style={{
                          color: "#002f80",
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        Withdraw Amount: $
                        {parseFloat(item.depositAmount).toFixed(2)}
                      </Text>
                    ) : (
                      <Text style={styles.amountText}>
                        Amount:{" "}
                        <Text style={{ color: "orange" }}>
                          ${item.amount.toFixed(2)}
                        </Text>
                      </Text>
                    )}
                    <Text style={styles.dateText}>
                      Withdraw Date:{" "}
                      {moment(item.withdrawDate).format("DD MMM YYYY")}
                    </Text>
                  </View>
                  <View>
                    {item.depositAmount ? (
                      <TouchableOpacity style={styles.completeButton} disabled>
                        <Text style={styles.completeButtonText}>Complete</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.button,
                          isBeforeCurrentDate
                            ? { backgroundColor: "#10B981" }
                            : { backgroundColor: "#991B1B" },
                        ]}
                        disabled={!isBeforeCurrentDate}
                        onPress={() => handleWithdrawDeposit(item?._id)}
                      >
                        {!isBeforeCurrentDate ? (
                          <Text
                            style={[
                              styles.buttonText,
                              { color: "gray", fontWeight: "bold" },
                            ]}
                          >
                            Pending Now
                          </Text>
                        ) : (
                          <Text style={styles.buttonText}>Withdraw Now</Text>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
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
            contentContainerStyle={{ paddingBottom: 165 }}
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
      {/* Deposit Money Modal */}
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
              backgroundColor: "#7D848D",
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
              <Text style={{ fontSize: 18, fontWeight: "500", color: "white" }}>
                Deposit Money
              </Text>
              <Icon
                onPress={() => setModal(false)}
                name="close-circle-outline"
                size={30}
                color="orange"
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
                placeholderTextColor={"#BEBFC1"}
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
                onChangeText={(value) => setAmount(value)}
                placeholderTextColor={"#BEBFC1"}
              />
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableHighlight
                  onPress={handelDeposit}
                  style={{
                    backgroundColor: "blue",
                    padding: 10,
                    borderRadius: 5,
                    alignItems: "center",
                    width: "40%",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      paddingHorizontal: 20,
                      fontSize: 15,
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#616672",
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 10,
  },
  amountText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#BABBBC",
  },
  dateText: {
    fontSize: 16,
    marginBottom: 16,
    color: "#BABBBC",
    fontWeight: "500",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ scale: 1.05 }],
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
  completeButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  completeButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
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
});

export default UserDeposit;

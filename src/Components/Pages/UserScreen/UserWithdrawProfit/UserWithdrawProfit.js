// Import necessary modules
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../../Shared/Header/Header";
import { AuthContext } from "../../../../Context/AuthProvider";
import axios from "axios";
import { BaseURL } from "../../../Shared/BaseURL/BaseURL";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";

// Define your component
const UserWithdrawProfit = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [amount, setAmount] = useState(null);
  const [profitData, setProfitData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const handelProfit = async () => {
    try {
      const response = await axios.put(
        `${BaseURL}/api/deposit/withdraw-profit-money?id=${selectedItem?._id}`,
        {
          amount: amount,
        }
      );
      if (response?.data.type === true) {
        ToastAndroid.show(response.data?.message, ToastAndroid.LONG);

        const adminProfit = {
          name: response?.data?.profit?.name,
          email: response?.data?.profit?.email,
          vat: response?.data?.profit?.profitPercentAmount,
        };
        adminProfitData(adminProfit);
        setModal(false);
      } else {
        ToastAndroid.show(response.data?.message, ToastAndroid.LONG);
      }
      setModal(false);
    } catch (error) {
      console.log("Error withdrawing profit:", error);
    }
  };

  const adminProfitData = async (adminProfit) => {
    try {
      const saveProfit = await axios.post(
        `${BaseURL}/api/profit/add-admin-profit`,
        adminProfit
      );
      const data = await saveProfit.data;
    } catch (error) {}
  };

  // Function to handle refreshing data
  const handleRefreshing = async () => {
    setLoading(true);
    try {
      const userDepositData = await axios.get(
        `${BaseURL}/api/deposit/get-deposit-transaction?email=${user?.email}`
      );
      const data = await userDepositData.data;
      setProfitData(data?.data);
    } catch (err) {
      // Handle error
      console.error(err);
    }
    setLoading(false);
  };

  // Fetch data on component mount
  useEffect(() => {
    handleRefreshing();
  }, []);

  // Render UI
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#323343" }}>
      {/* Header Section */}
      <Header navigation={navigation} />

      <View>
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
            Withdraw Profit Balance
          </Text>
        </View>

        {/* Loading indicator or profit list */}
        {loading ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color="#1E3A8A"
          />
        ) : (
          <FlatList
            data={profitData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              const formatedDate = moment(item?.profitWithdrawDate).format(
                "YYYY-MM-DD"
              );
              const currentDate = moment();
              const isBeforeCurrentDate =
                moment(formatedDate).isBefore(currentDate);

              return (
                <View style={styles.container}>
                  <View>
                    <Text style={styles.amountText}>
                      Current Deposit Balance:{" "}
                      <Text style={{ color: "orange" }}>
                        ${item.amount.toFixed(2)}
                      </Text>
                    </Text>
                    <Text style={styles.amountText}>
                      Profit Balance:{" "}
                      <Text style={{ color: "orange" }}>
                        ${item.profit.toFixed(2)}
                      </Text>
                    </Text>

                    <Text style={styles.additionalText}>
                      Client Deposit: ${item.clientDeposit.toFixed(2)}
                    </Text>
                    <Text style={styles.additionalText}>
                      Withdraw Profit Date:{" "}
                      {moment(item.profitWithdrawDate).format("DD MMM YYYY")}
                    </Text>
                  </View>
                  <View>
                    {item?.amount > 0 && (
                      <TouchableOpacity
                        style={[
                          styles.button,
                          isBeforeCurrentDate
                            ? { backgroundColor: "#10B981" }
                            : { backgroundColor: "#991B1B" },
                        ]}
                        disabled={!isBeforeCurrentDate}
                        onPress={() => {
                          setSelectedItem(item);
                          setModal(true);
                        }}
                      >
                        {!isBeforeCurrentDate ? (
                          <Text
                            style={[
                              styles.buttonText,
                              { color: "lightgrey", fontWeight: "bold" },
                            ]}
                          >
                            Withdraw Profit
                          </Text>
                        ) : (
                          <Text style={styles.buttonText}>Withdraw Profit</Text>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={() => (
              <View style={styles.information_container}>
                <Text style={styles.information_text}>
                  Profit Information Not Available
                </Text>
              </View>
            )}
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
                Withdraw Profit Balance
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
                placeholder={user?.email}
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
                  onPress={handelProfit}
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
                      fontWeight: "bold",
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
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ scale: 1.05 }],
  },
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
    marginBottom: 8,
    color: "#BABBBC",
    fontWeight: "500",
  },
  additionalText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#BABBBC",
  },
  completeButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
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
  completeButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
});

export default UserWithdrawProfit;

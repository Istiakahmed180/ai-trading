import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Context/AuthProvider";
import axios from "axios";
import Header from "../../../Shared/Header/Header";
import { BaseURL } from "../../../Shared/BaseURL/BaseURL";

const UserDashboard = ({ navigation }) => {
  const { user, refreshUser } = useContext(AuthContext);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [depositData, setDepositData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BaseURL}/api/deposit/get-deposit-transaction?email=${user?.email}`
      );
      setDepositData(response?.data?.data);
    } catch (error) {}
  };

  const calculateTotalAmount = () => {
    const total = depositData?.reduce((sum, currentObject) => {
      return sum + currentObject?.clientDeposit;
    }, 0);
    setTotalAmount(total);
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);

    refreshUser()
      .then(() => {
        fetchData();
        setIsRefreshing(false);
      })
      .catch((error) => {
        setIsRefreshing(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculateTotalAmount();
  }, [depositData]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <Header navigation={navigation} />

      {/* Body Section */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.mainContainer}>
          <View>
            <Text style={styles.welcomeBackText}>Hi, Welcomeback!</Text>
            <Text style={styles.userName}>
              {user?.firstName + " " + user?.lastName}
            </Text>
            <Text style={styles.email}>{user?.email}</Text>
            <Text style={styles.bangladeshText}>Bangladesh</Text>
          </View>
          <View style={styles.balanchContainer}>
            <View style={styles.currentBalanchWrapper}>
              <View>
                <Text style={styles.currentBalanceText}>Current Balance</Text>
                <Text style={styles.currentBalanceText1}>
                  ${user?.currentBalance.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={styles.totalDepositWrapper}>
              <View>
                <Text style={styles.totalDepositText}>Total Deposit</Text>
                <Text style={styles.totalDepositText1}>
                  ${totalAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.withdrawAmount}>
            <View style={styles.withdrawAmountWrapper}>
              <View>
                <Text style={styles.withdrawAmountText}>Withdraw Amount</Text>
                <Text style={styles.withdrawAmountText1}>
                  ${user?.withdrawalBalance.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#1F1E2E", flex: 1 },

  mainContainer: { marginHorizontal: 20, marginTop: 20 },

  welcomeBackText: { color: "#B0B0B8", fontSize: 25, fontWeight: "400" },

  userName: { fontSize: 22, color: "#1870D5", fontWeight: "600" },

  email: { fontSize: 18, color: "#D8A25D" },

  bangladeshText: { fontSize: 18, color: "#1870D5", fontWeight: "500" },

  balanchContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    columnGap: 20,
  },

  currentBalanchWrapper: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#272B3D",
    borderRadius: 10,
    width: "50%",
    paddingVertical: 15,
  },

  currentBalanceText: { color: "#B0B0B8", fontSize: 18, fontWeight: "500" },

  currentBalanceText1: {
    color: "#B4B4BC",
    fontSize: 25,
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },

  totalDepositWrapper: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#272B3D",
    borderRadius: 10,
    width: "50%",
    paddingVertical: 15,
  },

  totalDepositText: { color: "#B0B0B8", fontSize: 18, fontWeight: "500" },

  totalDepositText1: {
    color: "#B4B4BC",
    fontSize: 25,
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },

  withdrawAmount: { flexDirection: "row", justifyContent: "space-around" },

  withdrawAmountWrapper: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#272B3D",
    borderRadius: 10,
    width: "50%",
    paddingVertical: 15,
  },

  withdrawAmountText: { color: "#B0B0B8", fontSize: 18, fontWeight: "500" },

  withdrawAmountText1: {
    color: "#B4B4BC",
    fontSize: 25,
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default UserDashboard;

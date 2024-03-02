import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Dimensions,
} from "react-native";
import axios from "axios";
import Header from "../../../Shared/Header/Header";
import { BaseURL } from "../../../Shared/BaseURL/BaseURL";
import { AuthContext } from "../../../../Context/AuthProvider";

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
          <View style={styles.balanceContainer}>
            <View style={styles.balanceBox}>
              <Text style={styles.balanceTitle}>Current Balance</Text>
              <Text style={styles.balanceAmount}>
                ${user?.currentBalance.toFixed(2)}
              </Text>
            </View>
            <View style={styles.balanceBox}>
              <Text style={styles.balanceTitle}>Total Deposit</Text>
              <Text style={styles.balanceAmount}>
                ${totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={styles.withdrawContainer}>
            <View style={styles.withdrawBox}>
              <Text style={styles.withdrawTitle}>Daily Profit</Text>
              <Text style={styles.withdrawAmount}>
                ${user?.withdrawalBalance.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#1F1E2E", flex: 1 },
  mainContainer: { marginTop: 20, paddingHorizontal: "5%" },
  welcomeBackText: {
    color: "#B0B0B8",
    fontSize: Dimensions.get("window").width * 0.05,
    fontWeight: "400",
  },
  userName: {
    fontSize: Dimensions.get("window").width * 0.045,
    color: "#1870D5",
    fontWeight: "600",
  },
  email: { fontSize: Dimensions.get("window").width * 0.035, color: "#D8A25D" },
  bangladeshText: {
    fontSize: Dimensions.get("window").width * 0.035,
    color: "#1870D5",
    fontWeight: "500",
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "5%",
  },
  balanceBox: {
    backgroundColor: "#F2D9B8",
    width: "48%",
    paddingHorizontal: "3%",
    paddingVertical: "6%",
    borderRadius: 5,
  },
  balanceTitle: {
    color: "#39322B",
    fontSize: Dimensions.get("window").width * 0.035,
    fontWeight: "bold",
    marginBottom: "5%",
    textAlign: "center",
  },
  balanceAmount: {
    color: "#0EB64F",
    fontSize: Dimensions.get("window").width * 0.06,
    fontWeight: "bold",
    textAlign: "center",
  },
  withdrawContainer: {
    alignItems: "center",
    marginTop: "5%",
  },
  withdrawBox: {
    backgroundColor: "#F2D9B8",
    width: "50%",
    paddingHorizontal: "3%",
    paddingVertical: "6%",
    borderRadius: 5,
  },
  withdrawTitle: {
    color: "#39322B",
    fontSize: Dimensions.get("window").width * 0.035,
    fontWeight: "bold",
    marginBottom: "5%",
    textAlign: "center",
  },
  withdrawAmount: {
    color: "#0EB64F",
    fontSize: Dimensions.get("window").width * 0.06,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default UserDashboard;

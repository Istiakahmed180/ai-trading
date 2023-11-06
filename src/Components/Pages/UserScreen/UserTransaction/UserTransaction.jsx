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
import { BaseURL } from "../../../Shared/BaseURL/BaseURL";
import Header from "../../../Shared/Header/Header";

const UserTransaction = ({ navigation }) => {
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
    const total = depositData.reduce((sum, currentObject) => {
      return sum + currentObject?.amount;
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1C1C2E" }}>
      {/* Header Section */}
      <Header navigation={navigation} />
      {/* Body Section */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            backgroundColor: "#fff",
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
              {user.firstName + " " + user.lastName}
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 15,
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              {user.email}
            </Text>
          </View>

          <View style={styles.container}>
            <View style={styles.balanceContainer}>
              <View style={styles.balanceBox}>
                <Text style={styles.balanceText}>Current Balance</Text>
                <Text style={styles.balanceValue}>
                  ${user.currentBalance.toFixed(2)}
                </Text>
              </View>
              <View style={styles.balanceBox}>
                <Text style={styles.balanceText}>Total Balance</Text>
                <Text style={styles.balanceValue}>
                  ${user.totalBalance.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={styles.balanceContainer}>
              <View style={styles.balanceBox}>
                <Text style={styles.balanceText}>Total Deposit</Text>
                <Text style={styles.balanceValue}>
                  {totalAmount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.balanceBox}>
                <Text style={styles.balanceText}>Withdraw Balance</Text>
                <Text style={styles.balanceValue}>
                  ${user.withdrawalBalance.toFixed(2)}
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
  container: {
    flex: 1,
    backgroundColor: "#1C1C2E",
    padding: 20,
  },
  balanceContainer: {
    justifyContent: "space-between",
  },
  balanceBox: {
    backgroundColor: "#3C4151",
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  balanceText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#BBBCC3",
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "orange",
  },
});

export default UserTransaction;

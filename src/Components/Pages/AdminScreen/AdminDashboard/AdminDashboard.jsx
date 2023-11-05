import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Image,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Context/AuthProvider";
import axios from "axios";
import { BaseURL } from "../../../Shared/BaseURL/BaseURL";
import Header from "../../../Shared/Header/Header";
import moment from "moment";

const AdminDashboard = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vatSumByMonth, setVatSumByMonth] = useState([]);
  const [dailyProfit, setDailyProfit] = useState([]);
  const [totalProfit, setTotalProfit] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const groupByMonth = (data) => {
    return data.reduce((groups, item) => {
      const date = new Date(item?.date);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const key = `${year}-${month}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item?.vat);

      return groups;
    }, {});
  };

  const calculateSumByMonth = (data) => {
    const groupedData = groupByMonth(data);

    return Object.keys(groupedData).map((key) => ({
      month: key,
      sum: groupedData[key].reduce((acc, value) => acc + value, 0),
    }));
  };

  const totalDeduction = dailyProfit.reduce(
    (sum, item) => sum + item.deductionPercentAmount,
    0
  );

  const totalAdminiProfit = totalProfit.reduce(
    (sum, item) => sum + item.vat,
    0
  );

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const fetchData = async () => {
    setLoading(true);
    try {
      const getAdminProfit = await axios.get(
        `${BaseURL}/api/profit/get-admin-profit`
      );
      const data = getAdminProfit.data.data;
      setTotalProfit(data);

      const currentMonthData = data.filter((item) => {
        const date = new Date(item.date);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return month === currentMonth && year === currentYear;
      });

      const calculatedSumByMonth = calculateSumByMonth(currentMonthData);
      setVatSumByMonth(calculatedSumByMonth);
    } catch (error) {}
    setLoading(false);
  };

  const fetchRecentUsers = () => {
    axios
      .get(`${BaseURL}/api/auth/recent-users`)
      .then((res) => {
        setRecentUsers(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const fetchDailyProfit = async () => {
    const response = await axios.get(
      `${BaseURL}/api/profit/daily-admin-profit`
    );
    setDailyProfit(response.data.data);
  };

  useEffect(() => {
    fetchData();
  }, [currentMonth, currentYear]);

  useEffect(() => {
    fetchRecentUsers();
  }, []);

  useEffect(() => {
    fetchDailyProfit();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    await fetchRecentUsers();
    await fetchDailyProfit();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#323343" }}>
      <Header navigation={navigation} />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#1E3A8A"
          />
        }
      >
        {/* Body Section */}
        <View
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              backgroundColor: "#505562",
              paddingVertical: 30,
              marginHorizontal: 20,
              borderRadius: 10,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: 22,
              }}
            >
              Total Profit
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "orange",
                fontSize: 20,
              }}
            >
              $ {totalAdminiProfit}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#505562",
              paddingVertical: 30,
              marginHorizontal: 20,
              borderRadius: 10,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: 22,
              }}
            >
              Monthly Profit
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "orange",
                fontSize: 20,
              }}
            >
              $ {vatSumByMonth[0]?.sum}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#505562",
              paddingVertical: 30,
              marginHorizontal: 20,
              borderRadius: 10,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: 22,
              }}
            >
              Today Profit
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "orange",
                fontSize: 20,
              }}
            >
              $ {totalDeduction}
            </Text>
          </View>
          <View style={styles.container}>
            <Text style={styles.title}>Recent Client</Text>
            {recentUsers?.map((item) => (
              <View key={item?._id} style={styles.userItem}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                    <Text style={styles.userName}>
                      {item.firstName} {item.lastName}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#E5E7EB",
                      fontWeight: "600",
                    }}
                  >
                    {moment(item.date).format("DD MMM")}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#323343",
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#1CABE1",
  },
  userItem: {
    backgroundColor: "#505562",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "white",
  },
});

export default AdminDashboard;

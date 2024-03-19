import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Header from "../../../Shared/Header/Header";
import { AuthContext } from "../../../../Context/AuthProvider";
import { BaseURL } from "../../../Shared/BaseURL/BaseURL";
import axios from "axios";

const ProfitHistoryItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Deposit Balance:</Text>
        <Text style={styles.value}>{item.clientDeposit}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Withdraw Profit Balance:</Text>
        <Text style={styles.value}>{item.withdrawProfitAmount}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Received Profit Balance:</Text>
        <Text style={styles.value}>{item.deductionProfitAmount}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Profit Vat Balance:</Text>
        <Text style={styles.value}>{item.profitPercentAmount}</Text>
      </View>
    </View>
  );
};

const UserProfitHistory = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [userProfitHistoryData, setUserProfitHistoryData] = useState([]);

  const handleRefreshing = async () => {
    setLoading(true);
    try {
      const getUserProfitHistory = await axios.get(
        `${BaseURL}/api/profit/get-user-profit?email=${user?.email}`
      );
      const data = await getUserProfitHistory.data;

      setUserProfitHistoryData(data?.profit);
    } catch (error) {
      console.error("Error fetching profit history:", error);
    }
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
      <View style={{ paddingHorizontal: 16 }}>
        <View
          style={{
            backgroundColor: "#1E3A8A",
            padding: 15,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginTop: 15,
            marginBottom: 10,
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
            Withdraw Profit History
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
            data={userProfitHistoryData}
            keyExtractor={(item) => item?._id}
            renderItem={({ item }) => <ProfitHistoryItem item={item} />}
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
                  Withdraw Profit Invormation Not Available
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#272B3D",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: "lightgrey",
  },
  value: {
    fontSize: 16,
    color: "lightgrey",
  },
});

export default UserProfitHistory;

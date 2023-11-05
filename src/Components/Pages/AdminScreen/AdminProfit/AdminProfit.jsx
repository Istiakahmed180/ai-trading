import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BaseURL } from "../../../Shared/BaseURL/BaseURL";
import Header from "../../../Shared/Header/Header";
import moment from "moment";

const AdminProfit = ({ navigation }) => {
  const [adminProfit, setAdminProfit] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getAdminProfit = await axios.get(
          `${BaseURL}/api/profit/get-admin-profit`
        );
        const data = await getAdminProfit.data;
        setAdminProfit(data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header Section */}
      <Header navigation={navigation} />

      {/* Body Section */}
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
            Profit Info
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
            data={adminProfit}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              return (
                <View style={styles.container}>
                  <View style={styles.infoContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                    <Text style={styles.date}>
                      {moment(item.date).format("DD MMM")}
                    </Text>
                  </View>
                  <View style={styles.amountContainer}>
                    <Text style={styles.amount}>${item.vat}</Text>
                  </View>
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
                  Admin Profit Data Is Not Available
                </Text>
              </View>;
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    marginTop: 10,
    marginHorizontal: 10,
  },
  infoContainer: {
    flex: 1,
    marginRight: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#555555",
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "#777777",
  },
  amountContainer: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  amount: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
  },
});

export default AdminProfit;

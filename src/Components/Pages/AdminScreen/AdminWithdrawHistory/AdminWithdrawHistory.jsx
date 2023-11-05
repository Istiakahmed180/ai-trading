import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BaseURL } from "../../../Shared/BaseURL/BaseURL";
import Header from "../../../Shared/Header/Header";
import moment from "moment";

const AdminWithdrawHistory = ({ navigation }) => {
  const [approvalWithdrawData, setApprovalWithdrawData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleWithdrawRequestDelete = async (id) => {
    try {
      const deleteWithdrawData = await axios.delete(
        `${BaseURL}/api/withdraw/delete-withdraw-approved-request/${id}`
      );
      const data = await deleteWithdrawData.data;

      const filter = approvalWithdrawData?.filter((data) => data?._id !== id);
      setApprovalWithdrawData(filter);

      ToastAndroid.show(data?.message, ToastAndroid.LONG);

      handleRefreshing();
    } catch (error) {}
  };

  const handleRefreshing = async () => {
    setLoading(true);
    try {
      const getApprevedWithdrawData = await axios.get(
        `${BaseURL}/api/withdraw/get-approve-withdraw-request`
      );
      const data = await getApprevedWithdrawData.data;
      setApprovalWithdrawData(data?.data);
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    handleRefreshing();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1F1E2E" }}>
      {/* Header Section */}
      <Header navigation={navigation} />

      {/* Body Section */}
      <View
        style={{
          backgroundColor: "#1F1E2E",
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
            Withdraw History
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
            data={approvalWithdrawData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              return (
                <View style={styles.container}>
                  <View style={styles.infoContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                    <Text style={styles.amount}>
                      Client Get Amount ${item.amount}
                    </Text>
                    <Text style={styles.amount}>
                      Withdraw Amount: ${item.withdrawAmount}
                    </Text>
                    <Text style={styles.date}>
                      {moment(item.date).format("DD MMM")}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleWithdrawRequestDelete(item._id)}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
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
                  Withdraw History Not Available
                </Text>
              </View>;
            }}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    backgroundColor: "#6F7680",
  },
  infoContainer: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#E9E9E9",
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    color: "#E9E9E9",
  },
  amount: {
    fontSize: 16,
    marginBottom: 2,
    color: "#E9E9E9",
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "#B0B0B8",
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AdminWithdrawHistory;

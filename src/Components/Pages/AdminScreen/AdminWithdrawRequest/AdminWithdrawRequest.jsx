import {
  View,
  Text,
  ToastAndroid,
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

const AdminWithdrawRequest = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [withdrawRequest, setWithdrawRequest] = useState([]);

  const handleApprovedData = async (id) => {
    try {
      const saveApproveRequest = await axios.put(
        `${BaseURL}/api/withdraw/admin/approve/${id}`
      );
      const data = await saveApproveRequest.data;
      if (data) {
        const filter = withdrawRequest?.filter((item) => item?._id !== id);
        setWithdrawRequest(filter);

        ToastAndroid.show(data?.message, ToastAndroid.LONG);
      }
    } catch (error) {}
  };

  const handelDeleteWithdrawRequest = async (id) => {
    try {
      const deleteWithRequest = await axios.delete(
        `${BaseURL}/api/withdraw/delete-withdraw-approved-request/${id}`
      );

      const data = await deleteWithRequest.data;

      const filter = withdrawRequest?.filter((data) => data?._id !== id);
      setWithdrawRequest(filter);

      ToastAndroid.show(data?.message, ToastAndroid.LONG);
    } catch (error) {}
  };

  const handleRefreshing = async () => {
    setLoading(true);
    try {
      const getWithdrawRequest = await axios.get(
        `${BaseURL}/api/withdraw/admin/withdraw-request`
      );
      const data = await getWithdrawRequest.data;
      setTimeout(() => {
        setWithdrawRequest(data?.data);
      }, 500);
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    handleRefreshing();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#585966" }}>
      {/* Header Section */}
      <Header navigation={navigation} />

      {/* Body Section */}
      <View
        style={{
          backgroundColor: "#585966",
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
            Withdraw Request
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color="orange"
          />
        ) : (
          <FlatList
            data={withdrawRequest}
            keyExtractor={(item) => item?._id}
            renderItem={({ item }) => {
              return (
                <View style={styles.container}>
                  <Text style={styles.name}>{item?.name}</Text>
                  <Text style={styles.date}>
                    {moment(item?.date).format("DD MMM")}
                  </Text>
                  <Text style={styles.amount}>$ {item?.amount}</Text>
                  <Text style={styles.status}>{item?.approvalStatus}</Text>
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => handleApprovedData(item?._id)}
                    >
                      <Text style={styles.buttonText}>Approved</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handelDeleteWithdrawRequest(item?._id)}
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={() => {
              <View style={styles.information_container}>
                <Text style={styles.information_text}>
                  Withdraw Request Information Not Available
                </Text>
              </View>;
            }}
            contentContainerStyle={{ paddingBottom: 100 }}
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
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    marginHorizontal: 10,
    backgroundColor: "#6F7680",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  date: {
    fontSize: 16,
    color: "#B4B4BC",
    marginTop: 4,
  },
  amount: {
    fontSize: 20,
    marginTop: 8,
    fontWeight: "bold",
    color: "#fff",
  },
  status: {
    fontSize: 16,
    marginTop: 8,
    color: "orange",
    fontWeight: "400",
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
  },
  approveButton: {
    backgroundColor: "green",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
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
});

export default AdminWithdrawRequest;

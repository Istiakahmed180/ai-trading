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
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Context/AuthProvider";
import axios from "axios";
import { BaseURL } from "../../../Shared/BaseURL/BaseURL";
import Header from "../../../Shared/Header/Header";

const AdminInvestRequest = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [pendingRequest, setPendingRequest] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleApprovedData = async (id) => {
    try {
      const fetchApprovedData = await axios.put(
        `${BaseURL}/api/invest/admin/approve/${id}`
      );
      const data = await fetchApprovedData.data;
      if (data) {
        const filter = pendingRequest?.filter((item) => item?._id !== id);
        setPendingRequest(filter);
        ToastAndroid.show(data?.message, ToastAndroid.LONG);
      }
    } catch (error) {
      console.error("Error approving data:", error.message);
    }
  };

  const handleInvestRequestDelete = async (id) => {
    try {
      const fetchDeletetingData = await axios.delete(
        `${BaseURL}/api/invest/admin/invest-request-delete/${id}`
      );
      const data = await fetchDeletetingData?.data;

      const filter = pendingRequest?.filter(
        (requestDelete) => requestDelete?._id !== id
      );
      setPendingRequest(filter);

      ToastAndroid.show(data?.message, ToastAndroid.LONG);
    } catch (error) {}
  };

  const handleRefreshing = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BaseURL}/api/invest/admin/invest-request`
      );
      const data = await response?.data;
      setPendingRequest(data);
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    handleRefreshing();
  }, [token]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#474755" }}>
      {/* Header Section */}
      <Header navigation={navigation} />

      {/* Body Section */}
      <View
        style={{
          backgroundColor: "#474755",
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
            Invest Request
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
            data={pendingRequest}
            keyExtractor={(item) => item?._id}
            renderItem={({ item: pendingData }) => {
              const formattedDate = moment(pendingData?.date).format("DD MMM");

              return (
                <View key={pendingData?._id} style={styles.container}>
                  <Text style={styles.name}>{pendingData?.name}</Text>
                  <Text style={styles.date}>{formattedDate}</Text>
                  <Text style={styles.amount}>$ {pendingData?.amount}</Text>
                  <Text style={styles.status}>
                    {pendingData?.approvalStatus}
                  </Text>
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => handleApprovedData(pendingData?._id)}
                    >
                      <Text style={styles.buttonText}>Approved</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() =>
                        handleInvestRequestDelete(pendingData?._id)
                      }
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={() => (
              <View style={styles.information_container}>
                <Text style={styles.information_text}>
                  Invest Request Information Not Available
                </Text>
              </View>
            )}
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
    marginBottom: 16,
    borderRadius: 8,
    marginTop: 8,
    marginHorizontal: 10,
    backgroundColor: "#616672",
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
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
    fontWeight: "500",
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});

export default AdminInvestRequest;

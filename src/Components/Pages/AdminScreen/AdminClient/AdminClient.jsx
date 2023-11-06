import {
  View,
  Text,
  ToastAndroid,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  StyleSheet,
  RefreshControl,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Context/AuthProvider";
import axios from "axios";
import { BaseURL } from "../../../Shared/BaseURL/BaseURL";
import Header from "../../../Shared/Header/Header";
import moment from "moment";
import EyeIcon from "@expo/vector-icons/Feather";
import Icon from "react-native-vector-icons/Ionicons";

const AdminClient = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [allClient, setAllClient] = useState([]);
  const [checkClient, setCheckClient] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const handleClientDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${BaseURL}/api/invest/delete-client/${id}`
      );
      const data = await response.data;
      if (data.success) {
        const updateClient = allClient?.filter((client) => client?._id !== id);
        setAllClient(updateClient);
        ToastAndroid.show(data?.message, ToastAndroid.LONG);
      }
    } catch (err) {}
  };

  const handleRefresh = () => {
    setLoading(true);
    axios
      .get(`${BaseURL}/api/invest/all-client`)
      .then((res) => {
        setAllClient(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      {/* Header Section */}
      <Header navigation={navigation} />

      {/* Body Section */}
      <View
        style={{
          backgroundColor: "#323242",
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
            Client List
          </Text>
        </View>

        <FlatList
          data={allClient}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            return (
              <View style={styles.container}>
                <View style={styles.infoContainer}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.email}>{item.email}</Text>
                  <View style={styles.amountContainer}>
                    <Text style={styles.amount}>${item.amount}</Text>
                    <Text style={styles.date}>
                      {moment(item.date).format("DD MMM")}
                    </Text>
                  </View>
                  <Text style={styles.status}>{item.approvalStatus}</Text>
                </View>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => {
                      setModal(true);
                      setCheckClient(item);
                    }}
                  >
                    <EyeIcon name="eye" size={25} color="orange" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.textButton}
                    onPress={() => handleClientDelete(item._id)}
                  >
                    <Text style={styles.textButtonText}>Delete</Text>
                  </TouchableOpacity>
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
                Client Information Not Available
              </Text>
            </View>;
          }}
          contentContainerStyle={{ paddingBottom: 10 }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              colors={["#1E3A8A"]}
            />
          }
        />
      </View>
      <Modal animationType="slide" transparent={true} visible={modal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Client Details</Text>
              <Icon
                onPress={() => setModal(false)}
                name="close-circle-outline"
                size={30}
                color="red"
              />
            </View>
            <View style={{ alignSelf: "center", marginBottom: 10 }}>
              {checkClient?.image ? (
                <Image
                  source={{ uri: `${checkClient?.image}` }}
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
            </View>
            <Text style={styles.userEmail}>Email: istiakahmed@gmail.com</Text>

            <View style={styles.transactionInfoContainer}>
              <Text style={styles.transactionText}>
                Adding Transaction: ${checkClient.amount}
              </Text>
              <Text style={styles.additionalInfoText}>
                Phone:{" "}
                {checkClient.phone ? checkClient.phone : "No Information"}
              </Text>
              <Text style={styles.additionalInfoText}>
                Gender:{" "}
                {checkClient.gender ? checkClient.gender : "No Information"}
              </Text>
              <Text style={styles.additionalInfoText}>
                Address:{" "}
                {checkClient.address ? checkClient.address : "No Information"}
              </Text>
              <Text style={styles.clientIdText}>
                Client ID: {checkClient._id}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#616672",
  },
  infoContainer: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "white",
  },
  email: {
    fontSize: 14,
    color: "#c3c0c0",
    marginBottom: 8,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
    color: "orange",
  },
  date: {
    fontSize: 14,
    color: "#c2bfbf",
  },
  status: {
    fontSize: 14,
    color: "#28c400",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginRight: 16,
  },
  textButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#fd4d4d",
    borderRadius: 4,
  },
  textButtonText: {
    color: "#fd4d4d",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#6F7680",
    borderRadius: 15,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 10,
    color: "white",
  },
  transactionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  additionalInfoText: {
    fontSize: 16,
    marginBottom: 5,
    color: "white",
  },
  clientIdText: {
    fontSize: 16,
    marginTop: 10,
    color: "white",
  },
});

export default AdminClient;

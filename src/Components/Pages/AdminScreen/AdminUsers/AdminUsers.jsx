import {
  View,
  Text,
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

const AdminUsers = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [allUser, setAllUser] = useState([]);
  const [checkUser, setCheckUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const handleUsersDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${BaseURL}/api/auth/delete-user/${id}`
      );
      const data = await response.data;
      if (data.success) {
        const updateClient = allUser?.filter((client) => client?._id !== id);
        setAllUser(updateClient);
        ToastAndroid.show(data?.message, ToastAndroid.LONG);
      }
    } catch (err) {}
  };

  const handleRefresh = () => {
    setLoading(true);
    axios
      .get(`${BaseURL}/api/auth/all-users`)
      .then((res) => {
        setAllUser(res.data.users);
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
          backgroundColor: "#464755",
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
            Users List
          </Text>
        </View>

        <FlatList
          data={allUser}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            return (
              <View style={styles.container}>
                <View style={styles.infoContainer}>
                  <Text style={styles.name}>
                    {item.firstName + " " + item.lastName}
                  </Text>
                  <Text style={styles.email}>{item.email}</Text>
                  <Text style={styles.amount}>
                    Total Balance: ${item.totalBalance}
                  </Text>
                  <Text style={styles.date}>
                    Joining Date: {moment(item.date).format("DD MMM")}
                  </Text>
                  <Text style={styles.statusActive}>Active</Text>
                </View>
                <View style={styles.iconsContainer}>
                  <TouchableOpacity
                    style={[styles.iconButton, styles.eyeButton]}
                    onPress={() => {
                      setModal(true);
                      setCheckUser(item);
                    }}
                  >
                    <EyeIcon name="eye" size={20} color="#FFA500" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.iconButton, styles.deleteButton]}
                    onPress={() => handleUsersDelete(item._id)}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
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
              <Text style={styles.modalHeaderText}>Users Information</Text>
              <Icon
                onPress={() => setModal(false)}
                name="close-circle-outline"
                size={30}
                color="red"
              />
            </View>
            <View style={styles.userContainer}>
              {checkUser?.image ? (
                <Image
                  source={{ uri: `${checkUser?.image}` }}
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
              <Text style={styles.userEmail}>{checkUser?.email}</Text>
            </View>

            <View style={styles.transactionInfoContainer}>
              <Text style={styles.transactionText}>
                Total Balance: ${checkUser.totalBalance}
              </Text>
              <Text style={styles.transactionText}>
                Current Balance: ${checkUser.currentBalance}
              </Text>
              <Text style={styles.additionalInfoText}>
                Date: {moment(checkUser.date).format("DD MMM YYYY")}
              </Text>

              <Text style={styles.additionalInfoText}>
                Gender: {checkUser.gender || "No Information"}
              </Text>
              <Text style={styles.additionalInfoText}>
                Address: {checkUser.address || "No Information"}
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
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#616672",
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginRight: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
  },
  email: {
    fontSize: 14,
    color: "#ffffffa4",
    marginBottom: 5,
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
  },
  date: {
    fontSize: 14,
    color: "#ffffffc6",
    marginBottom: 5,
  },
  statusActive: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2ECC71",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  eyeButton: {
    backgroundColor: "#f0e68c",
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#ff6b6b",
  },
  deleteText: {
    fontSize: 16,
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#6F7680",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  userEmail: {
    fontSize: 16,
    color: "white",
  },
  transactionInfoContainer: {
    marginBottom: 10,
  },
  transactionText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
    color: "white",
  },
  additionalInfoText: {
    fontSize: 14,
    marginBottom: 3,
    color: "#ffffffaf",
  },
});

export default AdminUsers;

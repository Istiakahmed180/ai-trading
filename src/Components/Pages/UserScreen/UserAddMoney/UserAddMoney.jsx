import {
  View,
  Text,
  ToastAndroid,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Modal,
  TextInput,
  TouchableHighlight,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Context/AuthProvider";
import { BaseURL } from "../../../Shared/BaseURL/BaseURL";
import axios from "axios";
import Header from "../../../Shared/Header/Header";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import EyeIcon from "@expo/vector-icons/Feather";

const UserAddMoney = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState(null);
  const [userInvestmentData, setUserInvestmentData] = useState([]);
  const [viewingModal, setViewingModal] = useState({});
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmitAmount = async () => {
    const clientData = {
      name: user?.firstName + " " + user?.lastName,
      email: user?.email,
      image: user?.image,
      phone: user?.phone,
      address: user?.address,
      gender: user?.gender,
      amount: parseFloat(amount),
      bio: user?.bio,
    };

    try {
      const response = await axios.post(
        `${BaseURL}/api/invest/add-client`,
        clientData
      );
      const data = response.data;
      if (data.type) {
        ToastAndroid.show(data?.message, ToastAndroid.LONG);
        setModalVisible(false);
      } else {
        ToastAndroid.show(data?.message, ToastAndroid.LONG);
      }
    } catch (e) {}
  };

  const handleRefresh = async () => {
    setLoading(true);

    try {
      const userInvestmentData = await axios.get(
        `${BaseURL}/api/invest/get-user-investment-data?email=${user?.email}`
      );
      const data = await userInvestmentData.data;
      setUserInvestmentData(data?.data);
    } catch (error) {}

    setLoading(false);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <Header navigation={navigation} />

      {/* Body Section */}
      <View>
        <View style={styles.investmentWrapper}>
          <Text style={styles.investMoneyText}>Invest Money</Text>
          <TouchableOpacity
            style={styles.addMoneyContainer}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addMoneyText}>Add Money</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            style={styles.activatorLoading}
            size="large"
            color="#1E3A8A"
          />
        ) : (
          <FlatList
            data={userInvestmentData}
            keyExtractor={(item) => item?._id}
            renderItem={({ item }) => {
              return (
                <View style={styles.itemContainer}>
                  <View>
                    <Text style={styles.name}>{item?.name}</Text>
                    <Text style={styles.date}>
                      {moment(item?.date).format("DD MMM")}
                    </Text>
                    <Text style={styles.investmentAmount}>
                      Investment Amount : ${item?.amount}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setModal(true)}>
                    <EyeIcon
                      onPress={() => setViewingModal(item)}
                      name="eye"
                      size={25}
                      color={"#388DEC"}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
            // ListEmptyComponent should return JSX elements
            ListEmptyComponent={() => (
              <View style={styles.notAvailableConaine}>
                <Text style={styles.notAvailableText}>
                  Send Money Information Not Available
                </Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 345 }}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={handleRefresh}
                colors={["#1E3A8A"]}
              />
            }
          />
        )}
      </View>
      {/* Amount Submit Modal */}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Add Money</Text>
              <Ionicons
                onPress={() => setModalVisible(false)}
                name="close-circle-outline"
                size={30}
                color="#F7A524"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={user.email}
                editable={false}
                style={styles.input}
                keyboardType="email-address"
                placeholderTextColor={"#AFB1B5"}
              />
              <TextInput
                placeholder="Amount"
                style={styles.input}
                keyboardType="numeric"
                placeholderTextColor={"#AFB1B5"}
                onChangeText={(value) => setAmount(value)}
              />
              <View style={styles.submitButtonContainer}>
                <TouchableHighlight
                  style={styles.submitButton}
                  onPress={handleSubmitAmount}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* Information Viewing Modal */}
      <Modal animationType="slide" transparent={true} visible={modal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Transaction Details</Text>
              <Icon
                onPress={() => setModal(false)}
                name="close-circle-outline"
                size={30}
                color="#F7A524"
              />
            </View>
            <View style={styles.userInfoContainer}>
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
              <Text style={styles.userEmail}>Email: {viewingModal.email}</Text>
            </View>
            <View style={styles.transactionInfoContainer}>
              <Text style={{ color: "#9998A6" }}>
                Invest Transaction: ${viewingModal?.amount}
              </Text>
              <Text style={{ color: "#9998A6" }}>
                Total Transaction: ${user?.totalBalance}
              </Text>
              <Text style={{ color: "#9998A6" }}>
                Current Transaction: ${user?.currentBalance}
              </Text>
              <Text style={{ color: "#9998A6" }}>
                Date: {moment(viewingModal?.date).format("DD MMM")}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#1F1E2E", flex: 1 },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    backgroundColor: "#1F1E2E",
    borderRadius: 10,
    padding: 20,
    width: "90%",
  },

  inputContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: "white",
  },

  submitButton: {
    backgroundColor: "blue",
    borderRadius: 5,
    alignItems: "center",
    paddingVertical: "4%",
    paddingHorizontal: "5%",
  },

  submitButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: Dimensions.get("window").width * 0.045,
  },

  submitButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },

  infoContainer: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#388DEC",
  },

  date: {
    fontSize: 14,
    color: "#F5A623",
    marginBottom: 4,
    fontWeight: "500",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  modalHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B3B3BC",
  },

  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },

  userEmail: {
    fontSize: 16,
    color: "#9998A6",
  },

  transactionInfoContainer: {
    marginBottom: 15,
  },

  investmentWrapper: { justifyContent: "center", alignItems: "center" },

  investMoneyText: { fontSize: 25, color: "#AFAEB5", fontWeight: "500" },

  addMoneyContainer: {
    backgroundColor: "#3C58FA",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },

  addMoneyText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },

  activatorLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#272A3D",
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    marginTop: 10,
    marginHorizontal: 10,
  },

  investmentAmount: {
    color: "#9695A5",
    fontSize: 18,
    fontWeight: "400",
  },

  notAvailableConaine: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  notAvailableText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 40,
    color: "red",
    fontWeight: "bold",
  },
});

export default UserAddMoney;

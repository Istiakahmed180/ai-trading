import React, { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { AuthContext } from "../Context/AuthProvider";
import CustomDrawer from "./CustomDrawer";
import UserDashboard from "../Components/Pages/UserScreen/UserDashboard/UserDashboard";
import UserAddMoney from "../Components/Pages/UserScreen/UserAddMoney/UserAddMoney";
import UserSendMoney from "../Components/Pages/UserScreen/UserSendMoney/UserSendMoney";
import UserReceiveMoney from "../Components/Pages/UserScreen/UserReceiveMoney/UserReceiveMoney";
import UserWithdrawMoney from "../Components/Pages/UserScreen/UserWithdrawMoney/UserWithdrawMoney";
import UserDeposit from "../Components/Pages/UserScreen/UserDeposit/UserDeposit";
import UserTransaction from "../Components/Pages/UserScreen/UserTransaction/UserTransaction";
import AdminDashboard from "../Components/Pages/AdminScreen/AdminDashboard/AdminDashboard";
import AdminInvestRequest from "../Components/Pages/AdminScreen/AdminInvestRequest/AdminInvestRequest";
import AdminWithdrawRequest from "../Components/Pages/AdminScreen/AdminWithdrawRequest/AdminWithdrawRequest";
import AdminSendHistory from "../Components/Pages/AdminScreen/AdminSendHistory/AdminSendHistory";
import AdminReceiveHistory from "../Components/Pages/AdminScreen/AdminReceiveHistory/AdminReceiveHistory";
import AdminWithdrawHistory from "../Components/Pages/AdminScreen/AdminWithdrawHistory/AdminWithdrawHistory";
import AdminProfit from "../Components/Pages/AdminScreen/AdminProfit/AdminProfit";
import AdminClient from "../Components/Pages/AdminScreen/AdminClient/AdminClient";
import AdminUsers from "../Components/Pages/AdminScreen/AdminUsers/AdminUsers";
import AdminSettings from "../Components/Pages/AdminScreen/AdminSettings/AdminSettings";
import { Image } from "react-native";
import UserWithdrawProfit from "../Components/Pages/UserScreen/UserWithdrawProfit/UserWithdrawProfit";
import UserProfitHistory from "../Components/Pages/UserScreen/UserProfitHistory/UserProfitHistory";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: "#1E3A8A",
        drawerActiveTintColor: "white",
        drawerLabelStyle: { marginLeft: -25 },
      }}
    >
      {/* User Screen */}
      {user?.role === "user" && (
        <Drawer.Screen
          name="Dashboard"
          component={UserDashboard}
          options={{
            drawerIcon: ({ color, size }) => (
              <Image
                source={require("../../assets/home_8255990.png")}
                style={{ width: size, height: size }}
              />
            ),
          }}
        />
      )}
      {user?.role === "user" && (
        <Drawer.Screen
          name="Add Money"
          component={UserAddMoney}
          options={{
            drawerIcon: ({ size, color }) => (
              <Image
                source={require("../../assets/wallet_8403705.png")}
                style={{ width: size, height: size }}
              />
            ),
          }}
        />
      )}
      {user?.role === "user" && (
        <Drawer.Screen
          name="Send Money"
          component={UserSendMoney}
          options={{
            drawerIcon: ({ size, color }) => (
              <Image
                source={require("../../assets/transfer_1893821.png")}
                style={{ width: size, height: size }}
              />
            ),
          }}
        />
      )}
      {user?.role === "user" && (
        <Drawer.Screen
          name="Receive Money"
          component={UserReceiveMoney}
          options={{
            drawerIcon: ({ size, color }) => (
              <Image
                source={require("../../assets/salary_781764.png")}
                style={{ width: size, height: size }}
              />
            ),
          }}
        />
      )}
      {user?.role === "user" && (
        <Drawer.Screen
          name="Withdraw Money"
          component={UserWithdrawMoney}
          options={{
            drawerIcon: ({ size, color }) => (
              <Image
                source={require("../../assets/cash-withdrawal_5024665.png")}
                style={{ width: size, height: size }}
              />
            ),
          }}
        />
      )}
      {user?.role === "user" && (
        <Drawer.Screen
          name="Withdraw Profit"
          component={UserWithdrawProfit}
          options={{
            drawerIcon: ({ size, color }) => (
              <Image
                source={require("../../assets/withdraw_money.png")}
                style={{ width: size, height: size }}
              />
            ),
          }}
        />
      )}
      {user?.role === "user" && (
        <Drawer.Screen
          name="Profit History"
          component={UserProfitHistory}
          options={{
            drawerIcon: ({ size, color }) => (
              <Image
                source={require("../../assets/profit_history.png")}
                style={{ width: size, height: size }}
              />
            ),
          }}
        />
      )}
      {user?.role === "user" && (
        <Drawer.Screen
          name="My Deposit"
          component={UserDeposit}
          options={{
            drawerIcon: ({ size, color }) => (
              <Image
                source={require("../../assets/saving-money_3513490.png")}
                style={{ width: size, height: size }}
              />
            ),
          }}
        />
      )}
      {user?.role === "user" && (
        <Drawer.Screen
          name="Default Page"
          component={UserTransaction}
          options={{
            drawerIcon: ({ size, color }) => (
              <Image
                source={require("../../assets/crossed_7798731.png")}
                style={{ width: size, height: size }}
              />
            ),
          }}
        />
      )}
      {/* Admin Screen */}
      {user?.role === "admin" && (
        <Drawer.Screen
          name="Dashboard"
          component={AdminDashboard}
          options={{
            drawerIcon: ({ color, size }) => (
              <Image
                source={require("../../assets/home_8255990.png")}
                style={{ width: size, height: size }}
              />
            ),
          }}
        />
      )}
      {user?.role === "admin" && (
        <Drawer.Screen
          name="Invest Request"
          component={AdminInvestRequest}
          options={{
            drawerIcon: ({ color, size }) => (
              <Image
                source={require("../../assets/ppc_2266646.png")}
                style={{ width: size, height: size }}
              />
            ),
          }}
        />
      )}
      {user?.role === "admin" && (
        <Drawer.Screen
          name="Withdraw Request"
          component={AdminWithdrawRequest}
          options={{
            drawerIcon: ({ color, size }) => (
              <Image
                source={require("../../assets/question_9101876.png")}
                style={{ width: size, height: size }}
              />
            ),
          }}
        />
      )}
      {user?.role === "admin" && (
        <Drawer.Screen
          name="Send History"
          component={AdminSendHistory}
          options={{
            drawerIcon: ({ color, size }) => (
              <Image
                source={require("../../assets/unit-testing_10531810.png")}
                style={{ width: size, height: size }}
              />
            ),
          }}
        />
      )}
      {user?.role === "admin" && (
        <Drawer.Screen
          name="Receive History"
          component={AdminReceiveHistory}
          options={{
            drawerIcon: ({ color, size }) => (
              <Image
                source={require("../../assets/give-money_2510743.png")}
                style={{ width: size, height: size }}
              />
            ),
          }}
        />
      )}
      {user?.role === "admin" && (
        <Drawer.Screen
          name="Withdraw History"
          component={AdminWithdrawHistory}
          options={{
            drawerIcon: ({ color, size }) => (
              <Image
                source={require("../../assets/cash-withdrawal_5024665.png")}
                style={{ width: size, height: size }}
              />
            ),
          }}
        />
      )}
      {user?.role === "admin" && (
        <Drawer.Screen
          name="Profit"
          component={AdminProfit}
          options={{
            drawerIcon: ({ color, size }) => (
              <Image
                source={require("../../assets/money-bag_2108625.png")}
                style={{ width: size, height: size }}
              />
            ),
          }}
        />
      )}
      {user?.role === "admin" && (
        <Drawer.Screen
          name="My Client"
          component={AdminClient}
          options={{
            drawerIcon: ({ color, size }) => (
              <Image
                source={require("../../assets/client_5828115.png")}
                style={{ width: size, height: size }}
              />
            ),
          }}
        />
      )}
      {user?.role === "admin" && (
        <Drawer.Screen
          name="My Users"
          component={AdminUsers}
          options={{
            drawerIcon: ({ color, size }) => (
              <Image
                source={require("../../assets/users_1307714.png")}
                style={{ width: size, height: size }}
              />
            ),
          }}
        />
      )}
      {user?.role === "admin" && (
        <Drawer.Screen
          name="Settings"
          component={AdminSettings}
          options={{
            drawerIcon: ({ color, size }) => (
              <Image
                source={require("../../assets/settings_2698011.png")}
                style={{ width: size, height: size }}
              />
            ),
          }}
        />
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

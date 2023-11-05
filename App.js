import AuthProvider from "./src/Context/AuthProvider";
import AppNavigation from "./src/Navigation/AppNavigation";

export default function App() {
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  );
}

// src/App.jsx
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import AuthProvider from "./contexts/AuthContext";
import ScrollToTop from "./components/common/ScrollToTop";
import { ToastContainer } from "react-toastify";
import Chatbot from "./components/common/Chatbot";

const App = () => {
  return (
    <Router>
      <ScrollToTop showButton={true} /> {/* Tự động scroll + nút scroll */}
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
      <ToastContainer />
      <Chatbot />
    </Router>
  );
};

export default App;

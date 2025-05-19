// src/App.jsx
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import AuthProvider from "./contexts/AuthContext";
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
      <ToastContainer />
    </Router>
  );
};

export default App;

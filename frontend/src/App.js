import { useState } from "react";
import axios from "axios";

function App() {
    const [authToken, setAuthToken] = useState("");

    
    const login = async () => {
      await axios.post("http://localhost:5000/login", {}, { withCredentials: true });
      alert("Logged in successfully!");
  };
  const fetchDashboard = async () => {
    try {
        const response = await axios.get("http://localhost:5000/dashboard", { withCredentials: true });
        console.log(response.data);
    } catch (error) {
        console.error("Access denied", error.response.data);
    }
};
const logout = async () => {
  await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
  alert("Logged out successfully!");
};

    

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Cookie Demo</h1>
            <button onClick={login}>Login</button>
            <button onClick={fetchDashboard}>Dashboard</button>
            <button onClick={logout} style={{ marginLeft: "10px" }}>logout</button>
            </div>
    );
}

export default App;

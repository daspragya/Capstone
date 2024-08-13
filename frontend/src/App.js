import React, { useState, createContext, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const App = () => {
  return (
    <AuthContext.Provider value={useAuth()}>
      <Signup />
      <Login />
      <Dashboard />
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const [user, setUser] = useState(null);

  const signup = async (username, password, role) => {
    try {
      await axios.post("http://localhost:5000/signup", {
        username,
        password,
        role,
      });
      alert("User registered successfully");
    } catch (error) {
      alert("Error signing up");
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      setUser({ username: response.data.username, role: response.data.role });
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return {
    user,
    signup,
    login,
  };
};

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSignup = () => {
    signup(username, password, role);
  };

  return (
    <div>
      <h2>Signup</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">Select Role</option>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="recruiter">Recruiter</option>
      </select>
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    login(username, password);
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Please login to see your dashboard</div>;
  }

  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <p>Your role is: {user.role}</p>
      {user.role === "student" && <StudentPage />}
      {user.role === "teacher" && <TeacherPage />}
      {user.role === "recruiter" && <RecruiterPage />}
    </div>
  );
};

const StudentPage = () => <div>Student Page</div>;
const TeacherPage = () => <div>Teacher Page</div>;
const RecruiterPage = () => <div>Recruiter Page</div>;

export default App;

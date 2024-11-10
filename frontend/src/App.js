import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import SyllabusEditor from "./components/Dashboard/University/SyllabusEditor";
import Dashboard from "./components/Dashboard/Dashboard";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/syllabus-editor/:courseName"
            element={<SyllabusEditor />}
          />
          <Route
            path="/"
            element={
              <AuthContext.Consumer>
                {({ user }) =>
                  user ? <Link to="/dashboard" /> : <Link to="/signup" />
                }
              </AuthContext.Consumer>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

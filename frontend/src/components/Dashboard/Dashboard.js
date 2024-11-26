import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import StudentPage from "./Student/StudentPage";
import TeacherPage from "./University/TeacherPage";
import RecruiterPage from "./Recruiter/RecruiterPage";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import JDCreation from "./Recruiter/JDCreation";
import ManageRecruitment from "./Recruiter/ManageRecruitment";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0); // Manage active tab
  const navigate = useNavigate();

  if (!user) {
    return (
      <Container>
        <Typography variant="h6" gutterBottom>
          Please log in to view this content
        </Typography>
        <Button onClick={() => navigate("/login")} variant="contained">
          Go to Login
        </Button>
      </Container>
    );
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <div style={{ flexGrow: 1 }}>
            {user.role === "recruiter" && (
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor="inherit"
                indicatorColor="secondary"
                centered
              >
                <Tab label="Home" />
                <Tab label="JD Creation" />
                <Tab label="Manage Recruitment" />
              </Tabs>
            )}
          </div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              {user.details.legalName && user.details.legalName !== ""
                ? user.details.legalName
                : user.username}{" "}
              ({user.role})
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Container>
        {user.role === "student" && <StudentPage user={user} />}
        {user.role === "teacher" && <TeacherPage user={user} />}
        {user.role === "recruiter" && (
          <>
            {tabValue === 0 && <RecruiterPage user={user} />}
            {tabValue === 1 && (
              <div>
                <Typography variant="h4" gutterBottom>
                  <JDCreation user={user} />
                </Typography>
                {/* Add JD Creation content or component here */}
              </div>
            )}
            {tabValue === 2 && (
              <div>
                <ManageRecruitment user={user} />
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;

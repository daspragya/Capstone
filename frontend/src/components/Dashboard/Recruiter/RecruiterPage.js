import React, { useState, useEffect } from "react";
import ProfileUpdate from "./ProfileUpdate";
import AddRole from "./AddRole";
import RoleManagement from "./RoleManagement";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import axios from "axios";

const RecruiterPage = ({ user }) => {
  const [detailsExist, setDetailsExist] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [roles, setRoles] = useState([]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/get-roles`, {
        params: { username: user.username },
      });
      setRoles(response.data.roles);
    } catch (error) {
      console.error("Failed to fetch roles", error);
    }
  };

  useEffect(() => {
    setDetailsExist(user.details.companyName !== "");
    fetchRoles(); // Load roles from backend when the component mounts
  }, [user.details]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const handleRoleUpdate = async () => {
    await fetchRoles();
  };

  return (
    <div style={{ padding: "20px" }}>
      {!detailsExist ? (
        <ProfileUpdate user={user} setDetailsExist={setDetailsExist} />
      ) : (
        <>
          {roles.length === 0 ? (
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <Typography variant="h6">No roles added yet</Typography>
              <AddRole setRoles={fetchRoles} user={user} />
            </div>
          ) : (
            <>
              <AddRole setRoles={fetchRoles} user={user} />
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  marginBottom: "20px",
                }}
              >
                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  aria-label="role tabs"
                >
                  {roles.map((role, index) => (
                    <Tab label={role.roleTitle} key={index} />
                  ))}
                </Tabs>
              </Box>

              {roles.length > 0 && (
                <RoleManagement
                  role={roles[selectedTab]}
                  handleRoleUpdate={handleRoleUpdate}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default RecruiterPage;

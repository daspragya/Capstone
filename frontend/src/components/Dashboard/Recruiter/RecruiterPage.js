import React, { useState, useEffect, useContext } from "react";
import ProfileUpdate from "./ProfileUpdate";
import AddRole from "./AddRole";
import JobDescription from "./JobDescription";
import { Tabs, Tab, Box, Button } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";

const RecruiterPage = ({ user }) => {
  const [detailsExist, setDetailsExist] = useState(
    Object.keys(user.details).length > 0
  );
  const [selectedTab, setSelectedTab] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [roles, setRoles] = useState([]);
  const { updateRoleDetails } = useContext(AuthContext);

  useEffect(() => {
    setDetailsExist(Object.keys(user.details).length > 0);
    setRoles(user.details.Roles || []); // Load roles from user details
  }, [user.details]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setCandidates(roles[newValue].Candidates);
  };

  const handleAddRole = (newRole) => {
    updateRoleDetails(newRole);
  };

  return (
    <div style={{ padding: "20px" }}>
      {!detailsExist ? (
        <ProfileUpdate user={user} setDetailsExist={setDetailsExist} />
      ) : (
        <>
          <AddRole setRoles={handleAddRole} />
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
                <Tab label={role.RoleTitle} key={index} />
              ))}
            </Tabs>
          </Box>

          {roles.length > 0 && (
            <JobDescription
              role={roles[selectedTab].RoleTitle}
              setCandidates={setCandidates}
            />
          )}
        </>
      )}
    </div>
  );
};

export default RecruiterPage;

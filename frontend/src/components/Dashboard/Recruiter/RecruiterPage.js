import React, { useState, useEffect, useContext } from "react";
import ProfileUpdate from "./ProfileUpdate";
import RoleManagement from "./RoleManagement";
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
    setCandidates([]); // Reset the candidates when switching roles
  };

  const handleAddRole = (newRole) => {
    const updatedRoles = [...roles, newRole];
    setRoles(updatedRoles);
    updateRoleDetails({ Roles: updatedRoles });
  };

  return (
    <div style={{ padding: "20px" }}>
      {!detailsExist ? (
        <ProfileUpdate user={user} setDetailsExist={setDetailsExist} />
      ) : (
        <>
          <RoleManagement roles={roles} setRoles={handleAddRole} />
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

          {candidates.length > 0 && roles[selectedTab].Status === 1 && (
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                alert(`Conducting interviews for selected candidates`)
              }
              style={{ marginTop: "20px" }}
            >
              Conduct Online Interviews
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default RecruiterPage;

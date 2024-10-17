import React, { useState, useEffect } from "react";
import ProfileUpdate from "./ProfileUpdate";
import AddRole from "./AddRole";
import RoleManagement from "./RoleManagement";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Card,
  CardContent,
  Link,
  Grid,
} from "@mui/material";
import axios from "axios";

const RecruiterPage = ({ user }) => {
  const [detailsExist, setDetailsExist] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [roles, setRoles] = useState([]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-roles", {
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
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
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
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{ position: "sticky", top: "20px", height: "fit-content" }}
            >
              <Card style={{ marginBottom: "20px" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {user.details.companyName || "Company Name"}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      "& p": { margin: "8px 0" },
                      "& br": { display: "none" },
                    }}
                    dangerouslySetInnerHTML={{
                      __html:
                        user.details.companyDesc || "No description available.",
                    }}
                  />
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Website:{" "}
                    {user.details.companyWebsite ? (
                      <Link
                        href={user.details.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {user.details.companyWebsite}
                      </Link>
                    ) : (
                      "No website available"
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default RecruiterPage;

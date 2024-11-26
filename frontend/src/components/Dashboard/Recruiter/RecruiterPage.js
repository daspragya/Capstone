import React, { useState, useEffect } from "react";
import ProfileUpdate from "./ProfileUpdate";
import AddRole from "./AddRole";
import RoleManagement from "./RoleManagement";
import JDCreation from "./JDCreation"; // New JD Creation Component
import ManageRecruitment from "./ManageRecruitment"; // New Manage Recruitment Component
import { Box, Typography, Card, Grid, Container } from "@mui/material";

const RecruiterPage = ({ user }) => {
  const [detailsExist, setDetailsExist] = useState(false);
  const [selectedPage, setSelectedPage] = useState("home"); // Tracks the selected page

  useEffect(() => {
    setDetailsExist(user.details.companyName !== "");
  }, [user.details]);

  const handleNavigation = (page) => {
    setSelectedPage(page);
  };

  return (
    <div style={{ padding: "20px" }}>
      {!detailsExist ? (
        <ProfileUpdate user={user} setDetailsExist={setDetailsExist} />
      ) : (
        <>
          {selectedPage === "home" && (
            <Container>
              <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    onClick={() => handleNavigation("jdCreation")}
                    sx={{
                      cursor: "pointer",
                      textAlign: "center",
                      padding: "20px",
                      "&:hover": { boxShadow: 6 },
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      JD Creation
                    </Typography>
                    <Typography variant="body2">
                      Create job descriptions for your recruitment needs.
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    onClick={() => handleNavigation("manageRecruitment")}
                    sx={{
                      cursor: "pointer",
                      textAlign: "center",
                      padding: "20px",
                      "&:hover": { boxShadow: 6 },
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Manage Recruitment
                    </Typography>
                    <Typography variant="body2">
                      Oversee your recruitment activities and roles.
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Container>
          )}

          {selectedPage === "jdCreation" && <JDCreation user={user} />}

          {selectedPage === "manageRecruitment" && (
            <ManageRecruitment user={user} />
          )}
        </>
      )}
    </div>
  );
};

export default RecruiterPage;

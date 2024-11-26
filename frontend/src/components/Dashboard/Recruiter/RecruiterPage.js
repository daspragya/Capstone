import React, { useState, useEffect } from "react";
import ProfileUpdate from "./ProfileUpdate";
import AddRole from "./AddRole";
import RoleManagement from "./RoleManagement";
import JDCreation from "./JDCreation"; // New JD Creation Component
import ManageRecruitment from "./ManageRecruitment"; // New Manage Recruitment Component
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
} from "@mui/material";
import JDImage from "./JDImage.png"; // Image for JD Creation
import RecruitmentImage from "./RecruitmentImage.png"; // Image for Manage Recruitment

const RecruiterPage = ({ user }) => {
  const [detailsExist, setDetailsExist] = useState(false);
  const [selectedPage, setSelectedPage] = useState("home"); // Tracks the selected page

  useEffect(() => {
    setDetailsExist(user.details.companyName !== "");
  }, [user.details]);

  const handleNavigation = (page) => {
    setSelectedPage(page);
  };

  if (!detailsExist) {
    return <ProfileUpdate user={user} setDetailsExist={setDetailsExist} />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#121212", // Dark background
        color: "#e0e0e0", // Light text
        padding: "20px",
      }}
    >
      {selectedPage === "home" && (
        <>
          <Typography variant="h4" gutterBottom>
            Welcome, Recruiter
          </Typography>
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
            {/* JD Creation Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  backgroundColor: "#1e1e1e",
                  color: "#e0e0e0",
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.2s",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={JDImage}
                  alt="JD Creation"
                  sx={{ objectFit: "contain" }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    JD Creation
                  </Typography>
                  <Typography variant="body2">
                    Create job descriptions for your recruitment needs.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      backgroundColor: "#1e88e5",
                      "&:hover": { backgroundColor: "#1565c0" },
                    }}
                    onClick={() => handleNavigation("jdCreation")}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Manage Recruitment Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  backgroundColor: "#1e1e1e",
                  color: "#e0e0e0",
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.2s",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={RecruitmentImage}
                  alt="Manage Recruitment"
                  sx={{ objectFit: "contain" }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Manage Recruitment
                  </Typography>
                  <Typography variant="body2">
                    Oversee your recruitment activities and roles.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      backgroundColor: "#d32f2f",
                      "&:hover": { backgroundColor: "#b71c1c" },
                    }}
                    onClick={() => handleNavigation("manageRecruitment")}
                  >
                    Explore Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {selectedPage === "jdCreation" && <JDCreation user={user} />}
      {selectedPage === "manageRecruitment" && (
        <ManageRecruitment user={user} />
      )}
    </Box>
  );
};

export default RecruiterPage;

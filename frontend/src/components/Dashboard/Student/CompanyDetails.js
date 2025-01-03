import React, { useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Link,
  Grid,
  Button,
} from "@mui/material";
import RoleDetails from "./RoleDetails";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LockIcon from "@mui/icons-material/Lock"; // New icon for closed applications
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CompanyDetails = ({ company, onBack, user }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleClick = (role) => {
    setSelectedRole(role);
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
  };

  const handleBackToCompany = () => {
    setSelectedRole(null);
    onBack();
  };

  const renderStatusIcon = (role) => {
    const application = user.details.application_status.find(
      (app) => app.role_id === role.role_id
    );
    if (role.status === 0 && !application) {
      return <LockIcon style={{ marginLeft: "10px" }} color="action" />;
    }

    if (application) {
      switch (application.status) {
        case 5: // Rejected
          return <CancelIcon color="error" style={{ marginLeft: "10px" }} />;
        case 4: // Accepted
        case 3: // Interview completed
        case 2: // Interview stage
          return (
            <CheckCircleIcon color="success" style={{ marginLeft: "10px" }} />
          );
        case 1: // JD submitted, registration open
          // return <CheckIcon style={{ marginLeft: "10px" }} />;
          return <DoneAllIcon color="success" style={{ marginLeft: "10px" }} />;

        default:
          return null;
      }
    }
    return null;
  };

  return (
    <Box sx={{ mt: 2 }}>
      {!selectedRole ? (
        <>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <IconButton onClick={onBack} color="primary">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ ml: 1 }}>
              Back to Companies
            </Typography>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Typography variant="h6" gutterBottom>
                Available Roles
              </Typography>
              <Grid container spacing={2}>
                {company.roles.map((role) => (
                  <Grid item xs={12} sm={6} md={12} lg={6} key={role.role_id}>
                    <Card
                      variant="outlined"
                      onClick={() => handleRoleClick(role)}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          boxShadow: 3,
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {role.roleTitle}
                          {renderStatusIcon(role)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Location: {role.location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total CTC: {role.totalCTC}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{ mt: 2 }}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  position: "sticky",
                  top: "20px",
                  overflow: "hidden", // Ensure content doesn't overflow the box
                  maxHeight: "calc(100vh - 40px)", // Adjust height for sticky positioning
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optional shadow for better UI
                }}
              >
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", mb: 3 }}>
                      <img
                        src={`https://logo.clearbit.com/${
                          new URL(company.website).hostname
                        }`}
                        alt={`${company.name} logo`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "contain",
                          marginRight: "20px",
                          backgroundColor: "#f0f0f0", // Light gray background for transparency
                          borderRadius: "8px", // Rounded corners for better aesthetics
                        }}
                        onError={(e) =>
                          (e.target.src = "/default-placeholder.png")
                        }
                      />
                      <Box
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis", // Truncate overflowing text
                          maxWidth: "calc(100% - 120px)", // Account for logo width and margin
                          whiteSpace: "nowrap", // Optional: Keep on one line (adjust as needed)
                        }}
                      >
                        <Typography
                          variant="h4"
                          gutterBottom
                          sx={{
                            wordWrap: "break-word", // Allow breaking long words
                            overflowWrap: "break-word", // Ensure wrapping for long text
                            whiteSpace: "normal", // Allow multiple lines
                          }}
                        >
                          {company.name}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      sx={{
                        overflowWrap: "break-word", // Break long words
                        wordWrap: "break-word", // Ensure wrapping for long text
                        whiteSpace: "pre-line", // Preserve line breaks
                        "& p": { margin: "8px 0" }, // Adjust paragraph margins
                      }}
                      dangerouslySetInnerHTML={{
                        __html: company.description,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Website:{" "}
                      <Link
                        href={company.website}
                        target="_blank"
                        rel="noopener"
                        color="primary"
                      >
                        {company.website}
                      </Link>
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </>
      ) : (
        <RoleDetails
          role={selectedRole}
          onBack={handleBackToRoles}
          onBackToCompany={handleBackToCompany}
          company={company}
          user={user}
        />
      )}
    </Box>
  );
};

export default CompanyDetails;

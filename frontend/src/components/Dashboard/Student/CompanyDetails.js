import React, { useState, useContext } from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import RoleDetails from "./RoleDetails";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import { AuthContext } from "../../../context/AuthContext";

const CompanyDetails = ({ company, onBack, user }) => {
  const { refreshUserDetails } = useContext(AuthContext);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleClick = (role) => {
    setSelectedRole(role);
  };

  const handleBackToRoles = () => {
    refreshUserDetails();
    setSelectedRole(null);
  };

  const handleBackToCompany = () => {
    setSelectedRole(null);
    onBack();
  };

  const renderStatusIcon = (role) => {
    // Find the student's application status for this role
    const application = user.details.application_status.find(
      (app) => app.role_id === role.role_id
    );

    if (application) {
      switch (application.status) {
        case 5: // Rejected
          return <CancelIcon color="error" style={{ marginLeft: "10px" }} />;
        case 4: // Accepted
          return (
            <CheckCircleIcon color="success" style={{ marginLeft: "10px" }} />
          );
        case 3: // Interview completed
        case 2: // INterview stage
        case 1: // JD submitted, registration open
          return <CheckIcon style={{ marginLeft: "10px" }} />;
        default:
          return null;
      }
    }
    return null;
  };

  return (
    <div>
      {!selectedRole ? (
        <>
          <Button
            onClick={onBack}
            variant="outlined"
            style={{ marginBottom: "20px" }}
          >
            Back to Companies
          </Button>
          <Typography variant="h4" gutterBottom>
            {company.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {company.description}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Available Roles
          </Typography>
          <List>
            {company.roles.map((role) => (
              <React.Fragment key={role.role_id}>
                <ListItemButton onClick={() => handleRoleClick(role)}>
                  <ListItemText
                    primary={
                      <>
                        {role.roleTitle}
                        {renderStatusIcon(role)}
                      </>
                    }
                  />
                </ListItemButton>
                <Divider />
              </React.Fragment>
            ))}
          </List>
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
    </div>
  );
};

export default CompanyDetails;

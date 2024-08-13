import React, { useState } from "react";
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
    if (role.id === 4) {
      return <CancelIcon color="error" style={{ marginLeft: "10px" }} />;
    } else if (role.id === 3) {
      return <CheckCircleIcon color="success" style={{ marginLeft: "10px" }} />;
    } else if (role.id !== 1 && role.id !== 2) {
      return <CheckIcon style={{ marginLeft: "10px" }} />;
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
              <React.Fragment key={role.id}>
                <ListItemButton onClick={() => handleRoleClick(role)}>
                  <ListItemText
                    primary={
                      <>
                        {role.role}
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
        />
      )}
    </div>
  );
};

export default CompanyDetails;

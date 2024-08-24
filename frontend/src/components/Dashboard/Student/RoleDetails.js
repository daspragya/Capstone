import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Breadcrumbs,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import InterviewPage from "./InterviewPage";
import { AuthContext } from "../../../context/AuthContext";

const RoleDetails = ({ role, onBack, onBackToCompany, company, user }) => {
  const { refreshUserDetails } = useContext(AuthContext);
  const [status, setStatus] = useState(null); // Initialize status as null
  const [showInterview, setShowInterview] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    const application = user.details.application_status.find(
      (app) => app.role_id === role.role_id
    );

    if (application) {
      setStatus(application.status);
    } else {
      setStatus(0); // Default to "Apply" status
    }
  }, [role, user]);

  const handleApply = () => {
    setOpenConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setOpenConfirm(false);

    try {
      await axios.post("http://localhost:5000/apply-role", {
        username: user.username,
        role_id: role.role_id,
      });

      refreshUserDetails();
    } catch (error) {
      console.error("Error applying for the role:", error);
    }
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleStartInterview = () => {
    setShowInterview(true);
  };

  const handleFinishInterview = async () => {
    setShowInterview(false);
    try {
      await axios.post("http://localhost:5000/complete-interviews", {
        username: user.username,
        role_id: role.role_id,
      });
      refreshUserDetails();
    } catch (error) {
      console.error("Error applying for the role:", error);
    }
  };

  const renderStatusIcon = () => {
    if (status === 4) {
      // Accepted
      return <CheckCircleIcon color="success" style={{ marginLeft: "10px" }} />;
    } else if (status === 5) {
      // Rejected
      return <CancelIcon color="error" style={{ marginLeft: "10px" }} />;
    } else if (status !== 0) {
      // Applied or other statuses
      return <CheckIcon style={{ marginLeft: "10px" }} />;
    }
    return null;
  };

  const renderStatus = () => {
    if (status === 0) {
      // Apply
      return (
        <FormControlLabel
          control={<Checkbox checked={false} onChange={handleApply} />}
          label="Apply"
        />
      );
    } else {
      return (
        <>
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ marginTop: "10px" }}
          >
            Status: {getStatusText(status)} {renderStatusIcon()}
          </Typography>
          {status === 3 && ( // Interview stage
            <Button
              variant="contained"
              color="secondary"
              onClick={handleStartInterview}
              style={{ marginTop: "20px" }}
            >
              Start Interview
            </Button>
          )}
        </>
      );
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 6:
        return "Accepted";
      case 5:
        return "Rejected";
      case 4:
        return "Interview Completed, Processing";
      case 3:
        return "Interview Stage";
      case 2:
        return "Resume Shortlisted";
      case 1:
        return "Applied";
      default:
        return "Apply";
    }
  };

  return (
    <div>
      {!showInterview ? (
        <>
          <Breadcrumbs aria-label="breadcrumb" style={{ marginBottom: "20px" }}>
            <Link
              color="inherit"
              onClick={onBackToCompany}
              style={{ cursor: "pointer" }}
            >
              {company.name}
            </Link>
            <Typography color="textPrimary">{role.roleTitle}</Typography>
          </Breadcrumbs>

          <Button
            onClick={onBack}
            variant="outlined"
            style={{ marginBottom: "20px" }}
          >
            Back to Roles
          </Button>
          <Typography variant="h4" gutterBottom>
            {role.roleTitle} {renderStatusIcon()}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {role.roleDescription} {renderStatusIcon()}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {role.jd}
          </Typography>

          {renderStatus()}

          <Dialog open={openConfirm} onClose={handleCloseConfirm}>
            <DialogTitle>Confirm Application</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you wish to apply to {company.name} for the role{" "}
                {role.roleTitle} with your current resume?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirm} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmSubmit} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <InterviewPage onFinishInterview={handleFinishInterview} />
      )}
    </div>
  );
};

export default RoleDetails;

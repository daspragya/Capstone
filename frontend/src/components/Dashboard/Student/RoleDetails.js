import React, { useState, useEffect } from "react";
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
import InterviewPage from "./InterviewPage";

const RoleDetails = ({ role, onBack, onBackToCompany, company }) => {
  const initialStatus = role.id === 4 ? "Rejected" : "Apply"; // Initialize role.id=4 with 'Rejected'
  const [status, setStatus] = useState(initialStatus);
  const [showInterview, setShowInterview] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    if (status === "Applied") {
      if (role.id === 2) {
        setTimeout(() => {
          setStatus("Ongoing");
        }, 10000); // 10 seconds delay
      } else if (role.id === 1) {
        setTimeout(() => {
          setStatus("Rejected");
        }, 10000); // 10 seconds delay
      }
    } else if (status === "Processing") {
      setTimeout(() => {
        setStatus("Accepted");
      }, 20000); // 20 seconds delay
    }
  }, [status, role.id]);

  const handleApply = () => {
    setOpenConfirm(true);
  };

  const handleConfirmSubmit = () => {
    setOpenConfirm(false);
    setStatus("Applied");
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleStartInterview = () => {
    setShowInterview(true);
  };

  const handleFinishInterview = () => {
    setShowInterview(false);
    setStatus("Processing");
  };

  const renderStatusIcon = () => {
    if (status === "Accepted") {
      return <CheckCircleIcon color="success" style={{ marginLeft: "10px" }} />;
    } else if (status === "Rejected") {
      return <CancelIcon color="error" style={{ marginLeft: "10px" }} />;
    } else if (status !== "Apply") {
      return <CheckIcon style={{ marginLeft: "10px" }} />;
    }
    return null;
  };

  const renderStatus = () => {
    if (status === "Apply") {
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
            Status: {status} {renderStatusIcon()}
          </Typography>
          {status === "Ongoing" && (
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
            <Typography color="textPrimary">{role.role}</Typography>
          </Breadcrumbs>

          <Button
            onClick={onBack}
            variant="outlined"
            style={{ marginBottom: "20px" }}
          >
            Back to Roles
          </Button>
          <Typography variant="h4" gutterBottom>
            {role.role} {renderStatusIcon()}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {role.jd}
          </Typography>

          {renderStatus()}

          <Dialog open={openConfirm} onClose={handleCloseConfirm}>
            <DialogTitle>Confirm Application</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you wish to apply to {company.name} for the role{" "}
                {role.role} with your current resume?
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

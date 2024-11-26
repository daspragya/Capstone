import React, { useState, useEffect, useContext, useRef } from "react";
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
  IconButton,
  Box,
  Grid,
  Card,
  CardContent,
  Drawer,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CircularProgress from "@mui/material/CircularProgress";
import LockIcon from "@mui/icons-material/Lock";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import axios from "axios";
import { usePdf } from "@mikecousins/react-pdf";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InterviewPage from "./InterviewPage";
import { AuthContext } from "../../../context/AuthContext";

const RoleDetails = ({ role, onBack, onBackToCompany, company, user }) => {
  const { refreshUserDetails } = useContext(AuthContext);
  const [status, setStatus] = useState(null);
  const [candidateFeedback, setCandidateFeedback] = useState(null); // Feedback state
  const [feedbackDrawerOpen, setFeedbackDrawerOpen] = useState(false); // Drawer toggle
  const [showInterview, setShowInterview] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [jdDialogOpen, setJdDialogOpen] = useState(false);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const canvasRef = useRef(null);
  const [pdfFileUrl, setPdfFileUrl] = useState(null);
  const { pdfDocument } = usePdf({
    file: pdfFileUrl,
    page,
    canvasRef,
  });

  useEffect(() => {
    const application = user.details.application_status.find(
      (app) => app.role_id === role.role_id
    );

    if (application) {
      setStatus(application.status);

      // Extract candidate_feedback if status is not "Applied"
      if (application.status >= 1) {
        setCandidateFeedback(application.candidate_feedback || null);
      }
    } else {
      if (role.status === 0) setStatus(-1);
      else setStatus(0);
    }
  }, [role, user]);

  const handleApply = () => {
    setOpenConfirm(true);
  };

  const handleViewJD = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/view-jd/${role.role_id}`,
        {
          responseType: "blob",
        }
      );
      const fileURL = URL.createObjectURL(new Blob([response.data]));
      setPdfFileUrl(fileURL);
      setPage(1);
      setJdDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch JD", error);
    }
  };

  const handleViewResume = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/view-resume/${user.details._id}`,
        {
          responseType: "blob",
        }
      );
      const fileURL = URL.createObjectURL(new Blob([response.data]));
      setPdfFileUrl(fileURL);
      setPage(1);
      setResumeDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch Resume", error);
    }
  };

  const handleCloseJD = () => {
    setJdDialogOpen(false);
    setPdfFileUrl(null);
    setPage(1);
  };

  const handleCloseResume = () => {
    setResumeDialogOpen(false);
    setPdfFileUrl(null);
    setPage(1);
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
      console.error("Error completing the interview:", error);
    }
  };

  const renderStatusIcon = () => {
    if (status === 4 || status === 2 || status === 3) {
      return <CheckCircleIcon color="success" style={{ marginLeft: "10px" }} />;
    } else if (status === 5) {
      return <CancelIcon color="error" style={{ marginLeft: "10px" }} />;
    } else if (status === -1) {
      return <LockIcon style={{ marginLeft: "10px" }} />;
    } else if (status !== 0) {
      return <DoneAllIcon color="success" style={{ marginLeft: "10px" }} />;
    }
    return null;
  };

  const handleViewFeedback = () => {
    setFeedbackDrawerOpen(true);
  };

  const handleCloseFeedbackDrawer = () => {
    setFeedbackDrawerOpen(false);
  };

  const renderStatus = () => {
    if (status === 0) {
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
            sx={{ marginTop: "10px" }}
          >
            Status: {getStatusText(status)} {renderStatusIcon()}
            {status >= 1 && candidateFeedback && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleViewFeedback}
                sx={{ ml: 2 }}
              >
                View Feedback
              </Button>
            )}
          </Typography>
          {status === 3 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleStartInterview}
              sx={{ marginTop: "20px" }}
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
      case -1:
        return "Application Closed";
      default:
        return "Apply";
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={7}>
        {!showInterview ? (
          <>
            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{ marginBottom: "20px", color: "primary.main" }}
            >
              <Link
                color="inherit"
                onClick={onBackToCompany}
                sx={{ cursor: "pointer", color: "primary.main" }}
              >
                {company.name}
              </Link>
              <Typography color="textPrimary">{role.roleTitle}</Typography>
            </Breadcrumbs>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <IconButton onClick={onBack} color="primary">
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h5" sx={{ ml: 1 }}>
                Back to Roles
              </Typography>
            </Box>
            <Typography variant="h4" gutterBottom>
              {role.roleTitle} {renderStatusIcon()}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                "& p": { margin: "8px 0" },
                "& br": { display: "none" },
              }}
              dangerouslySetInnerHTML={{
                __html: role.roleDescription,
              }}
            />
            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleViewJD}
                sx={{ mr: 2 }}
              >
                View JD
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleViewResume}
              >
                View Resume
              </Button>
            </Box>
            {renderStatus()}
            <Dialog
              open={jdDialogOpen}
              onClose={handleCloseJD}
              maxWidth="md"
              fullWidth
            >
              <DialogContent>
                <Box
                  position="relative"
                  border="1px solid #ccc"
                  borderRadius="8px"
                  overflow="hidden"
                  height="600px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <canvas
                    ref={canvasRef}
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                  {page > 1 && (
                    <IconButton
                      onClick={() => setPage(page - 1)}
                      sx={{
                        position: "absolute",
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                      }}
                    >
                      <ArrowBackIosNewIcon />
                    </IconButton>
                  )}
                  {pdfDocument && page < pdfDocument.numPages && (
                    <IconButton
                      onClick={() => setPage(page + 1)}
                      sx={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                      }}
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                  )}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseJD} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={resumeDialogOpen}
              onClose={handleCloseResume}
              maxWidth="md"
              fullWidth
            >
              <DialogContent>
                <Box
                  position="relative"
                  border="1px solid #ccc"
                  borderRadius="8px"
                  overflow="hidden"
                  height="600px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <canvas
                    ref={canvasRef}
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                  {page > 1 && (
                    <IconButton
                      onClick={() => setPage(page - 1)}
                      sx={{
                        position: "absolute",
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                      }}
                    >
                      <ArrowBackIosNewIcon />
                    </IconButton>
                  )}
                  {pdfDocument && page < pdfDocument.numPages && (
                    <IconButton
                      onClick={() => setPage(page + 1)}
                      sx={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                      }}
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                  )}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseResume} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
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
                  onError={(e) => (e.target.src = "/default-placeholder.png")}
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

      {/* Drawer for Feedback */}
      <Drawer
        anchor="right"
        open={feedbackDrawerOpen}
        onClose={handleCloseFeedbackDrawer}
      >
        <Box width="400px" p={3}>
          <Typography variant="h6">Candidate Feedback</Typography>
          <Divider sx={{ my: 2 }} />
          {candidateFeedback ? (
            <>
              <Typography variant="body1">
                <strong>Pros:</strong> {candidateFeedback.pros}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Cons:</strong> {candidateFeedback.cons}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Skills to Develop:</strong>{" "}
                {candidateFeedback.skills_to_develop}
              </Typography>
            </>
          ) : (
            <Typography>No feedback available.</Typography>
          )}
        </Box>
      </Drawer>
    </Grid>
  );
};

export default RoleDetails;

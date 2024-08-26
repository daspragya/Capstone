import React, { useState, useRef } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  IconButton,
  CircularProgress,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { usePdf } from "@mikecousins/react-pdf";
import axios from "axios";
import { FileUpload } from "@mui/icons-material";

const StudentDetailsForm = ({ user, setDetailsExist }) => {
  const [details, setDetails] = useState({
    legalName: "",
    gender: "",
    gpa: "",
    resume: null,
  });
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const canvasRef = useRef(null);

  const { pdfDocument } = usePdf({
    file: fileUrl, // Use the file URL for rendering
    page,
    canvasRef,
  });

  function onFileChange(event) {
    const { files } = event.target;
    const nextFile = files?.[0];

    if (nextFile) {
      setFile(nextFile); // Store the actual file object
      setFileUrl(URL.createObjectURL(nextFile)); // Create a URL for the file
      setPage(1);
      setOpenDialog(true); // Open the dialog to show the PDF
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("legalName", details.legalName);
    formData.append("gender", details.gender);
    formData.append("gpa", details.gpa);
    formData.append("resume", details.resume);
    try {
      await axios.post("http://localhost:5000/update-details", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      user.details = details;
      setDetailsExist(true);
    } catch (error) {
      console.error("There was an error updating the details!", error);
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFile(null);
    setFileUrl(null);
    setPage(1);
    setLoading(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh" // Ensure the container takes the full height of the viewport
    >
      <Paper
        elevation={3}
        style={{ padding: "30px", maxWidth: "600px", margin: "auto" }}
      >
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Add Your Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Legal Name"
              name="legalName"
              value={details.legalName}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Gender"
              name="gender"
              value={details.gender}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              size="small"
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="GPA"
              name="gpa"
              value={details.gpa}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              border="2px dashed #ccc"
              borderRadius="8px"
              padding="20px"
              textAlign="center"
              sx={{
                "&:hover": {
                  borderColor: "primary.main",
                },
              }}
            >
              <FileUpload fontSize="large" color="action" />
              <Typography variant="body2" color="textSecondary">
                Upload Your Resume (PDF)
              </Typography>
              <input
                type="file"
                accept=".pdf"
                onChange={onFileChange}
                style={{ display: "none" }}
                id="upload-resume"
              />
              <label htmlFor="upload-resume">
                <Button
                  variant="contained"
                  component="span"
                  style={{ marginTop: "10px" }}
                >
                  Choose File
                </Button>
              </label>
              {details.resume && (
                <Typography
                  variant="body2"
                  color="textPrimary"
                  style={{ marginTop: "10px" }}
                >
                  {details.resume.name}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
              style={{ marginTop: "20px" }}
              disabled={loading}
            >
              Save Details
            </Button>
          </Grid>
        </Grid>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Preview Resume</DialogTitle>
          <DialogContent>
            {fileUrl && (
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
                    style={{
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
                    style={{
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
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setDetails((prevDetails) => ({
                  ...prevDetails,
                  resume: file,
                }));
                handleCloseDialog();
              }}
              disabled={loading}
            >
              Submit Resume
            </Button>
          </DialogActions>
          {loading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              marginTop="20px"
            >
              <CircularProgress />
              <Typography variant="body1" style={{ marginLeft: "10px" }}>
                Processing, please wait...
              </Typography>
            </Box>
          )}
        </Dialog>
      </Paper>
    </Box>
  );
};

export default StudentDetailsForm;

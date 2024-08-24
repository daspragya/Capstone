import React, { useState, useRef } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { usePdf } from "@mikecousins/react-pdf";

const UploadJobDescription = ({ handleJDUpload }) => {
  const [file, setFile] = useState(null); // Actual file object
  const [fileUrl, setFileUrl] = useState(null); // URL for display
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

  const handleSubmit = async () => {
    setLoading(true);
    await handleJDUpload(file); // Pass the actual file object
    setLoading(false);
    handleCloseDialog(); // Reset everything after submission
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFile(null);
    setFileUrl(null); // Clear the file URL
    setPage(1);
    setLoading(false); // Ensure loading is reset in case it was true
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ textAlign: "center", marginBottom: "20px" }}>
        <Typography variant="h4">Upload Job Description</Typography>
      </header>
      <div>
        <Box marginBottom="20px" textAlign="center">
          <input
            accept=".pdf"
            style={{ display: "none" }}
            id="upload-file"
            type="file"
            onChange={onFileChange}
          />
          <label htmlFor="upload-file">
            <Button variant="contained" color="primary" component="span">
              Choose File
            </Button>
          </label>
        </Box>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Preview Job Description</DialogTitle>
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
              onClick={handleSubmit}
              disabled={loading}
            >
              Submit Job Description
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
      </div>
    </div>
  );
};

export default UploadJobDescription;

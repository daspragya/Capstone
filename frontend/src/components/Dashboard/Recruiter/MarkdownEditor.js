import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Button,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import Markdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MarkdownEditor = ({ initialContent, username, role }) => {
  const [editorContent, setEditorContent] = useState(initialContent);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const navigate = useNavigate();

  // Track unsaved changes
  const handleEditorChange = (e) => {
    setEditorContent(e.target.value);
    setUnsavedChanges(true);
  };

  // Handle save action and fetch the PDF from the backend
  const handleSave = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/save-md-to-pdf",
        { markdownContent: editorContent },
        { responseType: "blob" } // Ensure the response is treated as a file
      );

      // Create a URL for the PDF blob
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      setPdfUrl(url);
      setPdfDialogOpen(true);
      setUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving Markdown to PDF:", error);
    }
  };

  // Trigger the exit dialog on unmount or navigation
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = ""; // Required for modern browsers
        setExitDialogOpen(true);
      }
    };

    // Add event listener for navigation attempts
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (unsavedChanges) {
        setExitDialogOpen(true);
      }
    };
  }, [unsavedChanges]);

  // Confirm exit without saving
  const confirmExit = () => {
    setExitDialogOpen(false);
    setUnsavedChanges(false);
    navigate(-1); // Navigate back or to the desired page
  };

  // Handle PDF download
  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.setAttribute("download", "markdown_preview.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    }
  };

  return (
    <Box
      sx={{
        width: "calc(100vw - 200px)",
        height: "calc(100vh - 70px)",
        display: "flex",
        flexDirection: "column",
        color: "#f5f5f5",
        overflow: "hidden",
      }}
    >
      {/* Content */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Editor */}
        <Box
          sx={{
            flex: 1,
            padding: 2,
            backgroundColor: "#2c2c2c",
            borderRight: "1px solid #444",
            overflowY: "auto",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ mb: 1, color: "#b0b0b0", fontWeight: "bold" }}
          >
            Edit Markdown
          </Typography>
          <TextField
            multiline
            minRows={15}
            value={editorContent}
            onChange={handleEditorChange}
            variant="outlined"
            fullWidth
            sx={{
              backgroundColor: "#333",
              borderRadius: 1,
              color: "#fff",
              "& .MuiInputBase-root": {
                color: "#fff",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#555",
                },
                "&:hover fieldset": {
                  borderColor: "#777",
                },
              },
            }}
          />
        </Box>

        {/* Preview */}
        <Box
          id="markdown-preview"
          sx={{
            flex: 1,
            padding: 2,
            backgroundColor: "#2c2c2c",
            overflowY: "auto",
            color: "#fff",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ mb: 1, color: "#b0b0b0", fontWeight: "bold" }}
          >
            Live Preview
          </Typography>
          <Markdown>{editorContent}</Markdown>
        </Box>
      </Box>

      {/* Floating Save Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
        }}
      >
        <Tooltip title="Save">
          <IconButton
            onClick={handleSave}
            sx={{
              backgroundColor: "#3f51b5",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#303f9f",
              },
            }}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Exit Confirmation Dialog */}
      <Dialog open={exitDialogOpen} onClose={() => setExitDialogOpen(false)}>
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <Typography>
            You have unsaved changes. Are you sure you want to leave this page?
            Your changes will be lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExitDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmExit} color="error">
            Leave
          </Button>
        </DialogActions>
      </Dialog>

      {/* PDF Display Dialog */}
      <Dialog
        open={pdfDialogOpen}
        onClose={() => setPdfDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Generated PDF</DialogTitle>
        <DialogContent>
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              style={{ width: "100%", height: "500px", border: "none" }}
              title="PDF Preview"
            ></iframe>
          ) : (
            <Typography>Loading PDF...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDownload} variant="contained" color="primary">
            Download PDF
          </Button>
          <Button onClick={() => setPdfDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MarkdownEditor;

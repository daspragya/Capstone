import React, { useContext, useState, useEffect } from "react";
import {
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import Markdown from "react-markdown";

const SyllabusEditor = ({ courseName, onSave, onCancel }) => {
  const { user } = useContext(AuthContext);

  const [editorContent, setEditorContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/get-syllabus", {
        params: { courseName, username: user.username, role: user.role },
      })
      .then((response) => {
        setEditorContent(response.data.syllabusContent);
      })
      .catch((error) => console.error("Error fetching syllabus:", error));
  }, [courseName]);

  const handleSave = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmSave = () => {
    setIsDialogOpen(false);

    axios
      .post("http://localhost:5000/modify-syllabus", {
        courseName,
        username: user.username,
        role: user.role,
        content: editorContent, // updated content from the editor
      })
      .then((response) => {
        console.log("Syllabus updated:", response.data.message);
        onSave(courseName, editorContent); // Call onSave callback
      })
      .catch((error) => console.error("Error updating syllabus:", error));
  };

  const handleCancelSave = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box
      sx={{
        width: "calc(100vw - 200px)",
        height: "calc(100vh - 80px)",
        display: "flex",
        flexDirection: "column",
        color: "#f5f5f5",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          color: "#f5f5f5",
        }}
      >
        <IconButton
          onClick={onCancel}
          sx={{ mr: 1, color: "#3f51b5", fontSize: 18, p: 1 }}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography
          variant="body1"
          sx={{ color: "#f5f5f5", cursor: "pointer", fontWeight: "bold" }}
          onClick={onCancel}
        >
          Back
        </Typography>
      </Box>

      {/* Editable Markdown Text Area and Live Preview Sections */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          padding: 2,
          gap: 2,
          overflow: "hidden", // Ensure scrollbars appear on overflow
        }}
      >
        {/* Markdown Editor */}
        <Box
          sx={{
            width: "50%",
            p: 3,
            backgroundColor: "#1b1b1b",
            border: "1px solid #333",
            borderRadius: 2,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            "&::-webkit-scrollbar": {
              width: "10px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#333",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#555",
              borderRadius: "5px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#777",
            },
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              color: "#b3b3b3",
              borderBottom: "1px solid #444",
              pb: 1,
            }}
          >
            Edit Markdown
          </Typography>
          <TextField
            multiline
            minRows={15}
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{
              backgroundColor: "#252525",
              borderRadius: 2,
              fontSize: "0.75rem",
              mt: 2,
              flex: 1,
              "& .MuiInputBase-root": {
                color: "#f5f5f5",
                overflowY: "auto",
                height: "100%", // Allow full height scrolling
                scrollbarWidth: "thin", // Firefox support
                "&::-webkit-scrollbar": {
                  width: "10px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#333",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#555",
                  borderRadius: "5px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#777",
                },
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#444",
                },
                "&:hover fieldset": {
                  borderColor: "#666",
                },
              },
            }}
          />
        </Box>

        {/* Live Markdown Preview */}
        <Box
          sx={{
            width: "50%",
            p: 3,
            backgroundColor: "#1b1b1b",
            border: "1px solid #333",
            borderRadius: 2,
            overflowY: "auto",
            fontSize: "0.75rem",
            color: "#f5f5f5",
            "&::-webkit-scrollbar": {
              width: "10px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#333",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#555",
              borderRadius: "5px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#777",
            },
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              color: "#b3b3b3",
              borderBottom: "1px solid #444",
              pb: 1,
            }}
          >
            Live Preview
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Markdown>{editorContent}</Markdown>
          </Box>
        </Box>
      </Box>

      {/* Save Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          display: "flex",
          gap: 2,
        }}
      >
        <Tooltip title="Save" placement="top">
          <IconButton
            onClick={handleSave}
            sx={{
              backgroundColor: "#3f51b5",
              color: "#fff",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                backgroundColor: "#303f9f",
              },
              borderRadius: "50%",
            }}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Dialog for Save Confirmation */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCancelSave}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#2b2b2b",
            color: "#f5f5f5",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Save</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to overwrite the existing syllabus content?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSave} sx={{ color: "#f5f5f5" }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmSave} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SyllabusEditor;

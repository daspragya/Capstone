import React, { useContext, useState, useEffect } from "react";
import {
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AuthContext } from "../../../context/AuthContext";
import ReactMarkdown from "react-markdown";
import axios from "axios";

const NewSyllabus = ({ onBack }) => {
  const { user } = useContext(AuthContext);
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [descriptionWordCount, setDescriptionWordCount] = useState(0);
  const [syllabusContent, setSyllabusContent] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Update word count whenever courseDescription changes
    setDescriptionWordCount(
      courseDescription.trim().split(/\s+/).filter(Boolean).length
    );
  }, [courseDescription]);

  const handleCreateSyllabus = async () => {
    if (!courseName.trim()) return;
    if (descriptionWordCount < 50 || descriptionWordCount > 100) {
      setDescriptionError(
        "Course description must be between 50 and 100 words."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/create-syllabus",
        {
          username: user.username,
          role: user.role,
          courseName,
          courseDescription,
        }
      );

      alert(response.data.message);
      setCourseName("");
      setCourseDescription("");
      setSyllabusContent(response.data.syllabusContent);
      setDescriptionError("");
      setIsDialogOpen(true); // Open dialog to show the syllabus content
    } catch (error) {
      console.error("Error creating syllabus:", error);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "0 auto",
        textAlign: "center",
        mt: 4,
        px: 2,
        color: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: "#1e1e1e",
          color: "#f5f5f5",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <IconButton onClick={onBack} sx={{ color: "#90caf9" }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ ml: 1, color: "#90caf9" }}>
            New Syllabus Generation
          </Typography>
        </Box>

        <Divider sx={{ my: 2, backgroundColor: "#444" }} />

        <Grid container spacing={2}>
          {/* Course Name Input */}
          <Grid item xs={12}>
            <TextField
              label="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              fullWidth
              required
              variant="outlined"
              sx={{
                mt: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#444",
                  },
                  "&:hover fieldset": {
                    borderColor: "#666",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#f5f5f5",
                },
                "& .MuiInputLabel-root": {
                  color: "#b0bec5",
                },
              }}
            />
          </Grid>

          {/* Course Description Input with Live Word Count */}
          <Grid item xs={12}>
            <TextField
              label="Course Description"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              fullWidth
              required
              variant="outlined"
              multiline
              minRows={3}
              helperText={`Provide a brief description (50-100 words). Word count: ${descriptionWordCount}`}
              error={Boolean(descriptionError)}
              sx={{
                mt: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#444",
                  },
                  "&:hover fieldset": {
                    borderColor: "#666",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#f5f5f5",
                },
                "& .MuiInputLabel-root": {
                  color: "#b0bec5",
                },
              }}
            />
            {descriptionError && (
              <Typography variant="caption" color="error" display="block">
                {descriptionError}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateSyllabus}
          sx={{ mt: 3, backgroundColor: "#90caf9", color: "#1e1e1e" }}
        >
          Create Syllabus
        </Button>
      </Paper>

      {/* Dialog to Display Generated Syllabus Content */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: "#1e1e1e", color: "#f5f5f5" }}>
          Syllabus Generated Successfully
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#252525", color: "#f5f5f5" }}>
          <Typography sx={{ mb: 2 }}>
            You can view and edit this syllabus in the "Previously Generated
            Syllabus" section.
          </Typography>
          <Divider sx={{ mb: 2, backgroundColor: "#444" }} />
          <Typography variant="h6" sx={{ color: "#90caf9" }}>
            Syllabus Preview:
          </Typography>
          <Box
            sx={{
              p: 2,
              mt: 1,
              backgroundColor: "#333",
              color: "#f5f5f5",
              borderRadius: 2,
            }}
          >
            <ReactMarkdown>{syllabusContent}</ReactMarkdown>
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#1e1e1e" }}>
          <Button onClick={handleCloseDialog} sx={{ color: "#90caf9" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewSyllabus;

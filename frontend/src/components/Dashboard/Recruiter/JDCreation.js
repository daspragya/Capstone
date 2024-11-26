import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import MarkdownEditor from "./MarkdownEditor"; // Import the editor component

const JDCreation = ({ user }) => {
  const [roleDomain, setRoleDomain] = useState("");
  const [hiringNeeds, setHiringNeeds] = useState("");
  const [specificBenefits, setSpecificBenefits] = useState("");
  const [editorVisible, setEditorVisible] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [jdGeneratedDialogOpen, setJdGeneratedDialogOpen] = useState(false);

  // Helper function to strip HTML tags from a string
  const stripHTML = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const handleSubmit = async () => {
    const plainCompanyDesc = stripHTML(user.details.companyDesc || "");
    const companyWebsite = user.details.companyWebsite || "No website provided";

    const requestData = {
      username: user.username,
      companyWebsite,
      hiringNeeds,
      specificBenefits,
      companyDesc: plainCompanyDesc,
    };

    console.log("Submitting data to backend:", requestData);

    try {
      const response = await axios.post(
        "http://localhost:5000/jd-creation",
        requestData,
        {
          responseType: "blob", // Treat response as a file
        }
      );

      // Read the received markdown content from the file
      const fileContent = await response.data.text();

      setEditorContent(fileContent); // Set content for the editor
      setJdGeneratedDialogOpen(true); // Show dialog after JD is generated
    } catch (error) {
      console.error("Error submitting data to backend:", error);
    }
  };

  const handleDialogConfirm = () => {
    setJdGeneratedDialogOpen(false);
    setEditorVisible(true); // Show the editor
  };

  const handleDialogCancel = () => {
    setJdGeneratedDialogOpen(false);
  };

  if (editorVisible) {
    return <MarkdownEditor initialContent={editorContent} />;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Job Description Creation
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Fill in the details below to create a job description.
      </Typography>

      {/* Role Domain */}
      <TextField
        label="Role Domain"
        fullWidth
        margin="normal"
        variant="outlined"
        value={roleDomain}
        onChange={(e) => setRoleDomain(e.target.value)}
        placeholder="Enter the domain of the role (e.g., Software Engineering, Marketing)"
      />

      {/* Hiring Needs */}
      <TextField
        label="Hiring Needs"
        fullWidth
        margin="normal"
        variant="outlined"
        multiline
        rows={4}
        value={hiringNeeds}
        onChange={(e) => setHiringNeeds(e.target.value)}
        placeholder="Describe the hiring needs for this role."
      />

      {/* Specific Benefits */}
      <TextField
        label="Specific Benefits"
        fullWidth
        margin="normal"
        variant="outlined"
        multiline
        rows={4}
        value={specificBenefits}
        onChange={(e) => setSpecificBenefits(e.target.value)}
        placeholder="Mention specific benefits offered for this role."
      />

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        Submit
      </Button>

      {/* JD Generated Dialog */}
      <Dialog open={jdGeneratedDialogOpen} onClose={handleDialogCancel}>
        <DialogTitle>JD Generated</DialogTitle>
        <DialogContent>
          <Typography>
            The Job Description has been generated successfully. You will now
            see the generated JD. Please make sure to save your changes before
            exiting.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel}>Cancel</Button>
          <Button onClick={handleDialogConfirm} color="primary">
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JDCreation;

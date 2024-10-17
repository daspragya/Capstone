import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import "react-quill/dist/quill.snow.css"; // Import the Quill CSS for styling
import ReactQuill from "react-quill"; // Import the Quill component

// Custom styles for the toolbar
import "./customQuillStyles.css";

const ProfileUpdate = ({ user, setDetailsExist }) => {
  const [details, setDetails] = useState({
    companyName: "",
    companyDesc: "",
    companyWebsite: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleDescriptionChange = (value) => {
    setDetails({ ...details, companyDesc: value });
  };

  const handleSubmit = async () => {
    user.details = {
      ...details,
      roles: [],
    };
    await axios.post("http://localhost:5000/update-details", {
      username: user.username,
      details: user.details,
    });
    setDetailsExist(true);
  };

  return (
    <Card
      sx={{
        maxWidth: 800,
        margin: "auto",
        padding: 4,
        boxShadow: 3,
        borderRadius: 3,
        mt: 5,
        backgroundColor: "#1c1c1c", // Dark background for card
        color: "#ffffff", // White text color for dark mode
      }}
    >
      <CardContent>
        <Typography variant="h4" gutterBottom color="primary" align="center">
          Update Company Profile
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="Company Name"
            name="companyName"
            value={details.companyName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{
              backgroundColor: "#2c2c2c", // Dark background for input fields
              borderRadius: 1,
              color: "#ffffff", // White text color for dark mode
              "& .MuiInputLabel-root": {
                color: "#bbbbbb", // Lighter label color for dark mode
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#444444", // Darker border color
                },
                "&:hover fieldset": {
                  borderColor: "#666666", // Lighter border on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2", // Primary color on focus
                },
              },
            }}
            InputProps={{
              style: { color: "#ffffff" }, // White text color inside input
            }}
          />
          <Typography variant="body1" gutterBottom>
            Company Description
          </Typography>
          <ReactQuill
            theme="snow"
            value={details.companyDesc}
            onChange={handleDescriptionChange}
            placeholder="Enter company description..."
            style={{
              marginBottom: "20px",
              backgroundColor: "#2c2c2c",
              color: "#ffffff",
            }} // Dark background for Quill editor
          />
          <TextField
            label="Company Website"
            name="companyWebsite"
            value={details.companyWebsite}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{
              backgroundColor: "#2c2c2c", // Dark background for input fields
              borderRadius: 1,
              color: "#ffffff", // White text color for dark mode
              "& .MuiInputLabel-root": {
                color: "#bbbbbb", // Lighter label color for dark mode
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#444444", // Darker border color
                },
                "&:hover fieldset": {
                  borderColor: "#666666", // Lighter border on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2", // Primary color on focus
                },
              },
            }}
            InputProps={{
              style: { color: "#ffffff" }, // White text color inside input
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 3 }}
            fullWidth
          >
            Save Profile
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileUpdate;

import React from "react";
import { Typography, Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Import the back arrow icon

const OptmizeSyllabus = ({ onBack }) => (
  <Box sx={{ textAlign: "center", mt: 4 }}>
    <IconButton onClick={onBack}>
      <ArrowBackIcon />
    </IconButton>
    <Typography variant="h4">Optmize Syllabus Generations</Typography>
    <Typography variant="body1">Here you can optimize syllabus.</Typography>
  </Box>
);

export default OptmizeSyllabus;

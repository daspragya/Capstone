import React from "react";
import { Button, Typography, Box } from "@mui/material";

const InterviewPage = ({ onFinishInterview }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#121212" // Dark background color
      padding="20px"
    >
      <Typography variant="h4" gutterBottom color="white">
        Interview Chatbot
      </Typography>
      <Box
        width="100%"
        height="60%"
        bgcolor="#1E1E1E" // Darker shade for the content box
        borderRadius="8px"
        padding="20px"
        boxShadow="0px 0px 10px rgba(0, 0, 0, 0.5)" // Adjust shadow for dark theme
        overflow="auto"
      >
        <Typography variant="body1" color="white">
          Welcome to your interview! Let's discuss your qualifications and
          experience.
        </Typography>
        <Typography variant="body2" color="gray" gutterBottom>
          (This is a simulated chatbot interaction)
        </Typography>
        {/* You can add more simulated conversation messages here */}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={onFinishInterview}
        style={{ marginTop: "20px" }}
      >
        Finish Interview
      </Button>
    </Box>
  );
};

export default InterviewPage;

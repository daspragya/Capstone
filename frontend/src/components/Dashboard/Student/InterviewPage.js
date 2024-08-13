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
      bgcolor="#f0f0f0"
      padding="20px"
    >
      <Typography variant="h4" gutterBottom>
        Interview Chatbot
      </Typography>
      <Box
        width="100%"
        height="60%"
        bgcolor="white"
        borderRadius="8px"
        padding="20px"
        boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
        overflow="auto"
      >
        <Typography variant="body1">
          Welcome to your interview! Let's discuss your qualifications and
          experience.
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
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

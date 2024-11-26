import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import StudentDetailsForm from "./StudentDetailsForm";
import CompanyList from "./CompanyList";
import ChatIcon from "@mui/icons-material/Chat";
import courseRecommendation from "./courseRecommendation.png";
import Recruitement from "./Recruitement.png";

const StudentPage = ({ user }) => {
  const isEmptyDetails = user.details.legalName === "";
  const [detailsExist, setDetailsExist] = useState(!isEmptyDetails);
  const [showRecruitmentPage, setShowRecruitmentPage] = useState(false);

  useEffect(() => {
    setDetailsExist(user.details.legalName !== "");
  }, [user.details]);

  const handleCourseRecommendation = () => {
    window.open("https://course-recomm-sahaay.streamlit.app/", "_blank");
  };

  const handleRecruitmentClick = () => {
    setShowRecruitmentPage(true);
  };

  const handleChatClick = () => {
    window.openCXGenieChatWidget();
  };

  if (showRecruitmentPage) {
    return (
      <div>
        {!detailsExist ? (
          <StudentDetailsForm user={user} setDetailsExist={setDetailsExist} />
        ) : (
          <>
            <CompanyList user={user} />
            <div onClick={handleChatClick} style={styles.chatBubble}>
              <span style={styles.chatText}>
                <ChatIcon />
              </span>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#121212", // Dark background
        color: "#e0e0e0", // Light text
        padding: "20px",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome, Student
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 4,
          mt: 4,
        }}
      >
        {/* First Card */}
        <Card
          sx={{
            width: 300,
            backgroundColor: "#1e1e1e",
            color: "#e0e0e0",
            "&:hover": {
              transform: "scale(1.05)",
              transition: "transform 0.2s",
            },
          }}
        >
          <CardMedia
            component="img"
            height="160"
            image={courseRecommendation}
            alt="Course Recommendation"
            sx={{
              objectFit: "contain", // Ensures the image fits within the container
            }}
          />
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Course Recommendation
            </Typography>
            <Typography variant="body2">
              Explore tailored courses to boost your career prospects. Click the
              button below to get personalized suggestions.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                backgroundColor: "#1e88e5",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
              onClick={handleCourseRecommendation}
            >
              Learn More
            </Button>
          </CardContent>
        </Card>

        {/* Second Card */}
        <Card
          sx={{
            width: 300,
            backgroundColor: "#1e1e1e",
            color: "#e0e0e0",
            "&:hover": {
              transform: "scale(1.05)",
              transition: "transform 0.2s",
            },
          }}
        >
          <CardMedia
            component="img"
            height="160"
            image={Recruitement}
            alt="Recruitment"
            sx={{
              objectFit: "contain", // Ensures the image fits within the container
            }}
          />
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recruitment Opportunities
            </Typography>
            <Typography variant="body2">
              Ready to step into the professional world? Discover companies
              looking for talented students like you.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              sx={{
                mt: 2,
                backgroundColor: "#d32f2f",
                "&:hover": {
                  backgroundColor: "#b71c1c",
                },
              }}
              onClick={handleRecruitmentClick}
            >
              Explore Now
            </Button>
          </CardContent>
        </Card>
      </Box>
      <div onClick={handleChatClick} style={styles.chatBubble}>
        <span style={styles.chatText}>
          <ChatIcon />
        </span>
      </div>
    </Box>
  );
};

const styles = {
  chatBubble: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    backgroundColor: "#333", // Dark bubble
    color: "#fff", // White text
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)", // Deeper shadow for dark theme
  },
  chatText: {
    fontSize: "14px",
    fontWeight: "bold",
  },
};

export default StudentPage;

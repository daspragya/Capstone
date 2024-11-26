import React, { useState } from "react";
import { Typography, Box, Grid } from "@mui/material";
import old from "./old.png";
import newSyl from "./new.png";
import enhance from "./enhance.png";
import PreviousSyllabus from "./PreviousSyllabus";
import NewSyllabus from "./NewSyllabus";
import OptmizeSyllabus from "./OptimizeSyllabus";
import "./TeacherPage.css";
import "../particles.css";

const TeacherPage = () => {
  const [selectedPage, setSelectedPage] = useState(null);

  const handleBack = () => setSelectedPage(null);

  // Show the selected page or the main menu
  if (selectedPage === "previous")
    return <PreviousSyllabus onBack={handleBack} />;
  if (selectedPage === "new") return <NewSyllabus onBack={handleBack} />;
  if (selectedPage === "optimize")
    return <OptmizeSyllabus onBack={handleBack} />;

  return (
    <>
      {/* Particle Container */}
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      <Box sx={{ mt: 3, textAlign: "center", mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Teacher's Syllabus Management
        </Typography>
        <Typography variant="subtitle1">
          Access, generate, and optimize syllabi for your courses with ease.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "70vh",
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: "600px",
            height: "400px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            item
            className="card"
            sx={{
              top: "40%",
              left: "25%",
              transform: "translate(-50%, -50%)",
            }}
            onClick={() => setSelectedPage("previous")}
          >
            <img src={old} alt="Syllabus History" />
            <Box className="hoverOverlay">
              <Typography variant="h6">
                Previous Syllabus Generations
              </Typography>
              <Typography variant="body2">
                View and manage previously generated syllabuses.
              </Typography>
            </Box>
          </Grid>

          <Grid
            item
            className="card"
            sx={{
              top: "40%",
              left: "80%",
              transform: "translate(-50%, -50%)",
            }}
            onClick={() => setSelectedPage("new")}
          >
            <img src={newSyl} alt="New Syllabus Generation" />
            <Box className="hoverOverlay">
              <Typography variant="h6">Generate a New Syllabus</Typography>
              <Typography variant="body2">
                Create a new syllabus based on your preferences.
              </Typography>
            </Box>
          </Grid>

          {/* <Grid
            item
            className="card"
            sx={{
              top: "90%",
              transform: "translate(-50%, -50%)",
            }}
            onClick={() => setSelectedPage("optimize")}
          >
            <img src={enhance} alt="Optimize Curriculum" />
            <Box className="hoverOverlay">
              <Typography variant="h6">Optimize Curriculum</Typography>
              <Typography variant="body2">
                Refine the curriculum to better meet student needs.
              </Typography>
            </Box>
          </Grid> */}
        </Grid>
      </Box>
    </>
  );
};

export default TeacherPage;

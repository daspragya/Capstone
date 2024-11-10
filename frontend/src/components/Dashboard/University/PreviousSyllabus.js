import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  Typography,
  Box,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  Drawer,
  Divider,
  Tooltip,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import ViewSyllabusDialog from "./ViewSyllabusDialog";
import SyllabusEditor from "./SyllabusEditor";

const PreviousSyllabus = ({ onBack }) => {
  const { user } = useContext(AuthContext);
  const [syllabi, setSyllabi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);

  useEffect(() => {
    const fetchSyllabi = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/get-syllabi", {
          params: { username: user.username, role: user.role },
        });
        setSyllabi(response.data.syllabi);
      } catch (error) {
        setError("Failed to fetch syllabi. Please try again.");
        console.error("Error fetching syllabi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabi();
  }, [user.username, user.role]);

  const handleViewSyllabus = useCallback(
    async (courseName) => {
      setDrawerOpen(false);
      try {
        const response = await axios.get(
          "http://localhost:5000/get-syllabus-pdf",
          {
            params: { courseName, username: user.username, role: user.role },
            responseType: "blob",
          }
        );
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setSelectedPdfUrl(pdfUrl);
        setOpenDialog(true);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    },
    [user]
  );

  const handleEditSyllabus = useCallback((courseName) => {
    setEditingCourse(courseName);
  }, []);

  const handleSave = (courseName, updatedContent) => {
    alert(`Saving ${courseName} with new content`);
    setEditingCourse(null);
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
  };

  const handleReadMore = (syllabus) => {
    setSelectedSyllabus(syllabus);
    setDrawerOpen(true);
  };

  const truncateText = (text, maxLength) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  const sharedStyles = {
    card: {
      backgroundColor: "#1e1e1e",
      color: "#f5f5f5",
      borderRadius: 2,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
      "&:hover": { boxShadow: "0 6px 12px rgba(0, 0, 0, 0.6)" },
    },
    iconButton: {
      color: "#90caf9",
    },
    headerText: {
      fontWeight: "bold",
      color: "#90caf9",
    },
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        px: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        color: "#f5f5f5",
        backgroundColor: "#121212",
        minHeight: "100vh",
        py: 4,
      }}
    >
      {editingCourse ? (
        <SyllabusEditor
          courseName={editingCourse}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              mb: 2,
              gap: 50, // Adjusts spacing between back button and heading
            }}
          >
            <Tooltip title="Go Back">
              <IconButton
                onClick={onBack}
                sx={{ color: "#3f51b5", fontSize: 18, p: 1 }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography variant="h5" sx={sharedStyles.headerText}>
              Previous Syllabus Generations
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 3, color: "#b0bec5" }}>
            Here you can view and manage previously generated syllabi.
          </Typography>

          {loading ? (
            <CircularProgress sx={{ color: "#90caf9", mt: 4 }} />
          ) : error ? (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          ) : syllabi.length > 0 ? (
            <Grid container spacing={3} justifyContent="center">
              {syllabi.map((syllabus, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card sx={sharedStyles.card}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={sharedStyles.headerText}>
                        {syllabus.courseName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#b0bec5", mt: 1 }}
                      >
                        {truncateText(syllabus.description, 100)}
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{ justifyContent: "space-between", px: 2 }}
                    >
                      <Box>
                        <Tooltip title="View PDF">
                          <IconButton
                            onClick={() =>
                              handleViewSyllabus(syllabus.courseName)
                            }
                            sx={sharedStyles.iconButton}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Syllabus">
                          <IconButton
                            onClick={() =>
                              handleEditSyllabus(syllabus.courseName)
                            }
                            sx={{ color: "#66bb6a" }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#90caf9", cursor: "pointer" }}
                        onClick={() => handleReadMore(syllabus)}
                      >
                        Read More
                      </Typography>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" sx={{ mt: 2, color: "#9e9e9e" }}>
              Generate a new Syllabus to view here!
            </Typography>
          )}

          {/* View PDF Dialog */}
          <ViewSyllabusDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            pdfUrl={selectedPdfUrl}
          />

          {/* Right Drawer for Full Description */}
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                width: 350,
                backgroundColor: "#1e1e1e",
                color: "#f5f5f5",
                padding: 3,
              },
            }}
          >
            {selectedSyllabus && (
              <>
                <Typography variant="h5" sx={sharedStyles.headerText}>
                  {selectedSyllabus.courseName}
                </Typography>
                <Divider sx={{ my: 2, backgroundColor: "#90caf9" }} />
                <Typography variant="body1" sx={{ color: "#b0bec5" }}>
                  {selectedSyllabus.description}
                </Typography>
              </>
            )}
          </Drawer>
        </>
      )}
    </Box>
  );
};

export default PreviousSyllabus;

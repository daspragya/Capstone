import React, { useState, useEffect, useRef } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  Button,
  Drawer,
  Divider,
} from "@mui/material";
import axios from "axios";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { usePdf } from "@mikecousins/react-pdf";

const CandidateDataGrid = ({ role, setSelectedCandidates }) => {
  const [candidateDetails, setCandidateDetails] = useState([]);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [summaryDrawerOpen, setSummaryDrawerOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [pdfFileUrl, setPdfFileUrl] = useState(null);
  const [page, setPage] = useState(1);
  const canvasRef = useRef(null);
  const { pdfDocument } = usePdf({
    file: pdfFileUrl,
    page,
    canvasRef,
  });

  const handleViewResume = async (candidateId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/view-resume/${candidateId}`,
        {
          responseType: "blob",
        }
      );
      const fileURL = URL.createObjectURL(new Blob([response.data]));
      setPdfFileUrl(fileURL);
      setPage(1); // Reset to the first page
      setResumeDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch resume", error);
    }
  };

  const handleViewSummary = (candidate) => {
    setSelectedCandidate(candidate);
    setSummaryDrawerOpen(true);
  };

  const handleCloseResumeDialog = () => {
    setResumeDialogOpen(false);
    setPdfFileUrl(null);
    setPage(1);
  };

  const handleCloseSummaryDrawer = () => {
    setSummaryDrawerOpen(false);
    setSelectedCandidate(null);
  };

  const columns = [
    { field: "legalName", headerName: "Name", width: 150 },
    { field: "gpa", headerName: "GPA", width: 100 },
    { field: "gender", headerName: "Gender", width: 100 },
    {
      field: "resume",
      headerName: "Resume",
      width: 200,
      renderCell: (params) => (
        <a
          href="#"
          style={{ color: "#3f51b5", textDecoration: "underline" }}
          onClick={(e) => {
            e.preventDefault(); // Prevent the default anchor behavior
            handleViewResume(params.row.id);
          }}
        >
          View Resume
        </a>
      ),
    },
    {
      field: "summary",
      headerName: "Student Summary",
      width: 200,
      renderCell: (params) => (
        <a
          href="#"
          style={{ color: "#3f51b5", textDecoration: "underline" }}
          onClick={(e) => {
            e.preventDefault(); // Prevent default anchor behavior
            handleViewSummary(params.row); // Call the function to view the summary
          }}
        >
          View Summary
        </a>
      ),
    },
    { field: "score", headerName: "Score", width: 150 },
  ];

  const fetchCandidateDetails = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/fetch-candidates",
        { role_id: role.role_id }
      );
      console.log(response);
      setCandidateDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch candidates", error);
    }
  };

  useEffect(() => {
    fetchCandidateDetails();
  }, [role]);

  return (
    <>
      <div style={{ marginTop: "20px", height: 400, width: "100%" }}>
        <DataGrid
          rows={candidateDetails}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(newSelection) => {
            setSelectedCandidates(newSelection);
          }}
        />
      </div>
      These students have selected post resume shortlisting. Download list as
      excel to continue further rounds.
      <Dialog
        open={resumeDialogOpen}
        onClose={handleCloseResumeDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <Box
            position="relative"
            border="1px solid #ccc"
            borderRadius="8px"
            overflow="hidden"
            height="600px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <canvas
              ref={canvasRef}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
            {page > 1 && (
              <IconButton
                onClick={() => setPage(page - 1)}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "white",
                }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
            )}
            {pdfDocument && page < pdfDocument.numPages && (
              <IconButton
                onClick={() => setPage(page + 1)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "white",
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResumeDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Drawer
        anchor="right"
        open={summaryDrawerOpen}
        onClose={handleCloseSummaryDrawer}
      >
        <Box width="400px" p={3}>
          <Typography variant="h6">Student Summary</Typography>
          <Divider style={{ margin: "10px 0" }} />
          {selectedCandidate ? (
            <>
              <Typography variant="body1">
                <strong>Name:</strong> {selectedCandidate.legalName}
              </Typography>
              <Typography variant="body1">
                <strong>GPA:</strong> {selectedCandidate.gpa}
              </Typography>
              <Typography variant="body1">
                <strong>Gender:</strong> {selectedCandidate.gender}
              </Typography>
              <Typography variant="body1">
                <strong>Score:</strong> {selectedCandidate.score}
              </Typography>
              <Typography variant="body1">
                <strong>Summary:</strong> {selectedCandidate.summary}
              </Typography>
            </>
          ) : (
            <Typography>No candidate selected.</Typography>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default CandidateDataGrid;

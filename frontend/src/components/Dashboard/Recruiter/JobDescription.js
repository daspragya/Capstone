import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  CircularProgress,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const JobDescription = ({ role, setCandidates }) => {
  const { user, updateRoleDetails } = useContext(AuthContext);
  const [jdFile, setJdFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidatesLocal] = useState([]);
  const [numCandidates, setNumCandidates] = useState(10);
  const [currentRole, setCurrentRole] = useState(role);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [conductingInterviews, setConductingInterviews] = useState(false);
  const [columns, setColumns] = useState([
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "gpa", headerName: "GPA", width: 100 },
    { field: "gender", headerName: "Gender", width: 100 },
    {
      field: "resume",
      headerName: "Resume",
      width: 200,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          View Resume
        </a>
      ),
    },
  ]);

  useEffect(() => {
    const roleData = user?.details?.Roles?.find((r) => r.RoleTitle === role);
    setCurrentRole(roleData);

    if (roleData?.Status === 1) {
      setCandidatesLocal(roleData.Candidates);
      setCandidates([]);
    }
  }, [role, user.details]);

  if (!currentRole) {
    return (
      <Typography variant="body1">
        Role not found or data is loading...
      </Typography>
    );
  }

  const handleJDUpload = (event) => {
    setJdFile(event.target.files[0]);
    setLoading(true);
    let currentCandidates = sampleCandidates.map((candidate) => candidate.id);
    setCandidates(currentCandidates);
    setCandidatesLocal(currentCandidates);

    const updatedRole = {
      ...currentRole,
      Candidates: currentCandidates,
      JD: event.target.files[0].name,
      Status: 1,
    };

    setTimeout(() => {
      setLoading(false);
    }, 5000);

    updateRoleDetails(updatedRole);
  };

  const sampleCandidates = [
    {
      id: 1,
      name: "John Doe",
      gpa: 3.8,
      gender: "Male",
      resume: "link-to-john-resume.pdf",
    },
    {
      id: 2,
      name: "Jane Smith",
      gpa: 3.6,
      gender: "Female",
      resume: "link-to-jane-resume.pdf",
    },
    {
      id: 3,
      name: "Michael Johnson",
      gpa: 3.9,
      gender: "Male",
      resume: "link-to-michael-resume.pdf",
    },
    {
      id: 4,
      name: "Emily Davis",
      gpa: 3.7,
      gender: "Female",
      resume: "link-to-emily-resume.pdf",
    },
    {
      id: 5,
      name: "William Brown",
      gpa: 3.5,
      gender: "Male",
      resume: "link-to-william-resume.pdf",
    },
    {
      id: 6,
      name: "Olivia Wilson",
      gpa: 4.0,
      gender: "Female",
      resume: "link-to-olivia-resume.pdf",
    },
    {
      id: 7,
      name: "James Taylor",
      gpa: 3.4,
      gender: "Male",
      resume: "link-to-james-resume.pdf",
    },
    {
      id: 8,
      name: "Sophia Martinez",
      gpa: 3.9,
      gender: "Female",
      resume: "link-to-sophia-resume.pdf",
    },
    {
      id: 9,
      name: "Benjamin Hernandez",
      gpa: 3.3,
      gender: "Male",
      resume: "link-to-benjamin-resume.pdf",
    },
    {
      id: 10,
      name: "Emma Lopez",
      gpa: 3.8,
      gender: "Female",
      resume: "link-to-emma-resume.pdf",
    },
    {
      id: 11,
      name: "Alexander Gonzalez",
      gpa: 3.9,
      gender: "Male",
      resume: "link-to-alexander-resume.pdf",
    },
    {
      id: 12,
      name: "Isabella King",
      gpa: 3.7,
      gender: "Female",
      resume: "link-to-isabella-resume.pdf",
    },
    {
      id: 13,
      name: "Daniel Wright",
      gpa: 3.6,
      gender: "Male",
      resume: "link-to-daniel-resume.pdf",
    },
    {
      id: 14,
      name: "Mia Scott",
      gpa: 4.0,
      gender: "Female",
      resume: "link-to-mia-resume.pdf",
    },
    {
      id: 15,
      name: "Logan Green",
      gpa: 3.2,
      gender: "Male",
      resume: "link-to-logan-resume.pdf",
    },
  ];

  const simulateFetchCandidates = (n) => {
    return sampleCandidates.slice(0, n);
  };

  const handleGetCandidates = () => {
    setLoading(true);
    const filteredCandidates = simulateFetchCandidates(numCandidates);
    setCandidatesLocal(filteredCandidates);
    setCandidates(filteredCandidates);

    setTimeout(() => {
      setLoading(false);
      const updatedRole = {
        ...currentRole,
        Status: 2,
        Candidates: filteredCandidates.map((candidate) => candidate.id),
      };
      updateRoleDetails(updatedRole);
    }, 10000);
  };

  const handleConductInterviews = () => {
    setOpenDialog(true);
  };

  const handleConfirmInterviews = () => {
    setOpenDialog(false);
    setLoading(true);

    // Filter selected candidates
    const selectedCandidateData = candidates.filter((candidate) =>
      selectedCandidates.includes(candidate.id)
    );

    // Simulate interview process
    setTimeout(() => {
      const interviewedCandidates = selectedCandidateData.map((candidate) => ({
        ...candidate,
        score: Math.floor(Math.random() * 100), // Simulate AI-generated score
      }));
      if (!columns.some((column) => column.field === "score")) {
        setColumns((prevColumns) => [
          ...prevColumns,
          { field: "score", headerName: "Score", width: 100 },
        ]);
      }

      setCandidatesLocal(interviewedCandidates);
      setCandidates(interviewedCandidates);
      setConductingInterviews(true); // Set to true after conducting interviews
      setLoading(false);
    }, 10000);
  };

  return (
    <div>
      <h2>{role} role</h2>

      {currentRole?.description && (
        <Typography variant="body1" style={{ marginBottom: "20px" }}>
          {currentRole.description}
        </Typography>
      )}

      {currentRole.Status === 0 && (
        <>
          <h3>Upload Job Description</h3>
          <input type="file" onChange={handleJDUpload} />
          {jdFile && <p>Uploaded: {jdFile.name}</p>}
        </>
      )}

      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop="20px"
        >
          <CircularProgress />
          <Typography variant="body1" style={{ marginLeft: "10px" }}>
            Processing, please wait...
          </Typography>
        </Box>
      )}

      {!loading && currentRole.Status === 1 && (
        <>
          <Typography variant="h6">
            Deadline met. {candidates.length} candidates registered.
          </Typography>
          <Box display="flex" marginTop="20px">
            <TextField
              label="Number of Candidates to Fetch"
              type="number"
              value={numCandidates}
              onChange={(e) => setNumCandidates(e.target.value)}
              fullWidth
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGetCandidates}
          >
            Fetch {numCandidates} Candidates
          </Button>
        </>
      )}

      {!loading && candidates.length > 0 && currentRole.Status === 2 && (
        <>
          <div style={{ marginTop: "20px", height: 400, width: "100%" }}>
            <DataGrid
              rows={candidates}
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(newSelection) => {
                setSelectedCandidates(newSelection);
              }}
            />
          </div>

          <Button
            variant="contained"
            color="secondary"
            style={{ marginTop: "20px" }}
            onClick={handleConductInterviews}
            disabled={selectedCandidates.length === 0}
          >
            Conduct Interviews
          </Button>
        </>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{"Conduct AI-assisted Interviews?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Conduct AI-assisted interviews for all the selected candidates? The
            rest of them will be rejected from the process.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmInterviews} color="primary" autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default JobDescription;

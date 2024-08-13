import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  CircularProgress,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { format, addDays } from "date-fns";

const JobDescription = ({ role, setCandidates }) => {
  const { user, updateRoleDetails } = useContext(AuthContext);
  const [jdFile, setJdFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidatesLocal] = useState([]);
  const [numCandidates, setNumCandidates] = useState(10);
  const [deadlineMet, setDeadlineMet] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);

  useEffect(() => {
    const roleData = user?.details?.Roles?.find((r) => r.RoleTitle === role);
    setCurrentRole(roleData);

    if (roleData && roleData.Deadline) {
      const deadlineDate = new Date(roleData.Deadline);
      if (deadlineDate <= new Date()) {
        setDeadlineMet(true);
      }
    }

    if (roleData?.Status === 1) {
      setCandidatesLocal(roleData.Candidates);
      setCandidates(roleData.Candidates);
    }
  }, [role]);

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

    const deadline = addDays(new Date(), 7);
    const updatedRole = {
      ...currentRole,
      JD: jdFile.name,
      Deadline: deadline,
      Status: 1,
    };

    updateRoleDetails(updatedRole);

    setTimeout(() => {
      const filteredCandidates = simulateFetchCandidates(numCandidates);
      setCandidatesLocal(filteredCandidates);
      setCandidates(filteredCandidates);
      setLoading(false);

      updatedRole.Candidates = filteredCandidates.map(
        (candidate) => candidate.id
      );
      updateRoleDetails(updatedRole);
    }, 10000);
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

  const columns = [
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
  ];

  const handleGetCandidates = () => {
    const filteredCandidates = simulateFetchCandidates(numCandidates);
    setCandidatesLocal(filteredCandidates);
    setCandidates(filteredCandidates);

    const updatedRole = {
      ...currentRole,
      Candidates: filteredCandidates.map((candidate) => candidate.id),
    };
    updateRoleDetails(updatedRole);
  };

  return (
    <div>
      <h3>Job Description for {role} role</h3>

      {currentRole.Status === 0 && (
        <>
          <input type="file" onChange={handleJDUpload} />
          <TextField
            label="Number of Candidates to Fetch"
            type="number"
            value={numCandidates}
            onChange={(e) => setNumCandidates(e.target.value)}
            fullWidth
          />
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
            Processing the job description, please wait...
          </Typography>
        </Box>
      )}

      {deadlineMet && currentRole.Status === 1 && (
        <>
          <Typography variant="h6">
            Deadline met. {candidates.length} candidates registered.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGetCandidates}
          >
            Fetch {numCandidates} Candidates
          </Button>
        </>
      )}

      {!loading && candidates.length > 0 && currentRole.Status === 1 && (
        <div style={{ marginTop: "20px", height: 400, width: "100%" }}>
          <DataGrid
            rows={candidates}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            checkboxSelection
          />
        </div>
      )}

      {currentRole.Status === 2 && (
        <>
          <Typography variant="h6">
            Candidates selected for interviews:
          </Typography>
          <DataGrid
            rows={candidates}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
          />
        </>
      )}
    </div>
  );
};

export default JobDescription;

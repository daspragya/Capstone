import React, { useState, useContext } from "react";
import { Typography, Button } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import UploadJobDescription from "./UploadJobDescription";
import FetchCandidates from "./FetchCandidates";
import CandidateDataGrid from "./CandidateDataGrid";
import ConfirmInterview from "./ConfirmInterview";
import axios from "axios";

const RoleManagement = ({ role, handleRoleUpdate }) => {
  const { user } = useContext(AuthContext);
  const [jdFile, setJdFile] = useState(null);
  const [candidateDetails, setCandidateDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [columns, setColumns] = useState([
    { field: "legalName", headerName: "Name", width: 150 },
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
    { field: "score", headerName: "Score", width: 150 },
  ]);

  const handleJDUpload = async (file) => {
    setJdFile(file);
    setLoading(true);

    const formData = new FormData();
    formData.append("jd", file);
    formData.append("username", user.username);
    formData.append("role_id", role.role_id);

    try {
      await axios.post("http://localhost:5000/upload-jd", formData);
      handleRoleUpdate();
    } catch (error) {
      console.error("Failed to upload JD", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async (k) => {
    try {
      await axios.post("http://localhost:5000/match_resume", {
        numCandidates: k,
        username: user.username,
        role_id: role.role_id,
      });
      handleRoleUpdate();
    } catch (error) {
      console.error("Failed to fetch required Candidates", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidateDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/fetch-candidates",
        { role_id: role.role_id }
      );
      const updatedLabel =
        role.status === 2 ? "Resume Match Percentage" : "Interview Score";
      setCandidateDetails(response.data);
      handleRoleUpdate();
    } catch (error) {
      console.error("Failed to fetch candidates", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConductInterviews = () => {
    setOpenDialog(true);
  };

  const handleConfirmInterviews = async () => {
    setOpenDialog(false);
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/update-candidates-status", {
        role_id: role.role_id,
        selected_candidates: selectedCandidates,
      });
      handleRoleUpdate();
    } catch (error) {
      console.error("Failed to conduct interviews", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishInterviews = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/finish-interviews", {
        role_id: role.role_id,
      });
      handleRoleUpdate();
      if (!columns.some((column) => column.field === "score")) {
        setColumns((prevColumns) => [
          ...prevColumns,
          { field: "score", headerName: "Interview Score", width: 150 },
        ]);
      }
    } catch (error) {
      console.error("Failed to finish interviews", error);
    } finally {
      setLoading(false);
    }
  };

  if (!role) {
    return (
      <Typography variant="body1">
        Role not found or data is loading...
      </Typography>
    );
  }

  return (
    <div>
      <h2>{role.roleTitle} role</h2>
      <h3>Description</h3>
      <Typography variant="body1" style={{ marginBottom: "20px" }}>
        {role.roleDescription}
      </Typography>

      {role.status === 0 && (
        <UploadJobDescription
          jdFile={jdFile}
          handleJDUpload={handleJDUpload}
          loading={loading}
        />
      )}
      {!loading && role.status === 1 && (
        <FetchCandidates
          candidates={role.candidates}
          handleFetch={handleFetch}
        />
      )}
      {!loading && (role.status === 2 || role.status === 4) && (
        <CandidateDataGrid
          fetchCandidateDetails={fetchCandidateDetails}
          candidates={candidateDetails}
          columns={columns}
          setSelectedCandidates={setSelectedCandidates}
          handleConductInterviews={handleConductInterviews}
          selectedCandidates={selectedCandidates}
          status={role.status}
        />
      )}
      {!loading && role.status === 3 && (
        <Button onClick={handleFinishInterviews} color="primary">
          Finish Interviews and Generate Scores
        </Button>
      )}
      <ConfirmInterview
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleConfirmInterviews={handleConfirmInterviews}
      />
    </div>
  );
};

export default RoleManagement;

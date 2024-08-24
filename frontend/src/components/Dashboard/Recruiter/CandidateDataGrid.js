import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button, Typography } from "@mui/material";
import axios from "axios";

const CandidateDataGrid = ({
  role,
  status,
  columns,
  setSelectedCandidates,
  selectedCandidates,
  handleConductInterviews,
}) => {
  const [candidates, setCandidateDetails] = useState({});
  const fetchCandidateDetails = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/fetch-candidates",
        { role_id: role.role_id }
      );
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
      {status === 2 && (
        <Button
          variant="contained"
          color="secondary"
          style={{ marginTop: "20px" }}
          onClick={handleConductInterviews}
          disabled={selectedCandidates.length === 0}
        >
          Conduct Interviews
        </Button>
      )}
      {status === 4 && (
        <Typography variant="body1" style={{ marginBottom: "20px" }}>
          Download Excel sheet to conduct further offline interviews
        </Typography>
      )}
    </>
  );
};

export default CandidateDataGrid;

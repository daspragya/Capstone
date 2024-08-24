import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

const FetchCandidates = ({ candidates, handleFetch, handleRefresh }) => {
  const [numCandidates, setNumCandidates] = useState(0);

  const handleFetchClick = () => {
    handleFetch(numCandidates);
  };

  const handleRefreshClick = () => {
    handleRefresh();
  };

  return (
    <>
      <Typography variant="h6">
        Deadline met. {candidates.length} candidates registered.
      </Typography>
      <Box display="flex" marginTop="20px" marginBottom="10px">
        <TextField
          label="Number of Candidates to Fetch"
          type="number"
          value={numCandidates}
          onChange={(e) => setNumCandidates(e.target.value)}
          fullWidth
        />
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Button variant="contained" color="primary" onClick={handleFetchClick}>
          Fetch {numCandidates} Candidates
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleRefreshClick}
        >
          Refresh Candidates Count
        </Button>
      </Box>
    </>
  );
};

export default FetchCandidates;

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  // CircularProgress,
} from "@mui/material";

const FetchCandidates = ({ candidates, handleFetch }) => {
  const [numCandidates, setNumCandidates] = useState(0);
  const handleFetchClick = () => {
    handleFetch(numCandidates);
  };
  return (
    <>
      {/* {loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop="20px"
        >
          <CircularProgress />
          <Typography variant="body1" style={{ marginLeft: "10px" }}>
            Fetching candidates, please wait...
          </Typography>
        </Box>
      )} */}
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
      <Button variant="contained" color="primary" onClick={handleFetchClick}>
        Fetch {numCandidates} Candidates
      </Button>
    </>
  );
};

export default FetchCandidates;

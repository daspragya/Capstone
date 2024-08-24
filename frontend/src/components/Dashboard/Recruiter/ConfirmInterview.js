import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const ConfirmInterview = ({
  openDialog,
  setOpenDialog,
  handleConfirmInterviews,
}) => {
  return (
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
  );
};

export default ConfirmInterview;

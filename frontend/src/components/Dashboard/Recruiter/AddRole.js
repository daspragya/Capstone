import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";

const AddRole = ({ setRoles }) => {
  const [open, setOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");

  const handleAddRole = () => {
    const newRoleData = {
      RoleTitle: newRole,
      RoleDescription: newRoleDescription,
      JD: null,
      Candidates: [],
      Deadline: null,
      Status: 0, // Initially, no JD is uploaded
    };

    setRoles(newRoleData);
    setNewRole("");
    setNewRoleDescription("");
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        style={{ float: "right", marginBottom: "20px" }}
      >
        + Add Role
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Role</DialogTitle>
        <DialogContent>
          <TextField
            label="Role Name"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            fullWidth
          />
          <TextField
            label="Role Description"
            value={newRoleDescription}
            onChange={(e) => setNewRoleDescription(e.target.value)}
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddRole} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddRole;

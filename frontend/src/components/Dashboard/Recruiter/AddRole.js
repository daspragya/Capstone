import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";

const AddRole = ({ setRoles, user }) => {
  const [open, setOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [roleDescriptionError, setRoleDescriptionError] = useState(false);
  const [roleNameError, setRoleNameError] = useState(false);

  const handleAddRole = async () => {
    if (newRole.trim() === "") {
      setRoleNameError(true);
      return;
    }

    if (newRoleDescription.length < 250) {
      setRoleDescriptionError(true);
      return;
    }

    const newRoleData = {
      RoleTitle: newRole,
      RoleDescription: newRoleDescription,
    };
    try {
      await axios.post(`http://localhost:5000/add-role`, {
        username: user.username,
        role: newRoleData,
      });
      setRoles();
      setNewRole("");
      setNewRoleDescription("");
      setRoleDescriptionError(false);
      setRoleNameError(false);
      setOpen(false);
    } catch (error) {
      console.error("Failed to add role", error);
    }
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

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Role</DialogTitle>
        <DialogContent>
          <Box mb={2} sx={{ width: "100%" }}>
            <TextField
              label="Role Name"
              value={newRole}
              onChange={(e) => {
                setNewRole(e.target.value);
                if (e.target.value.trim() !== "") {
                  setRoleNameError(false);
                }
              }}
              fullWidth
              required
              error={roleNameError}
              helperText={roleNameError ? "Role name is required." : ""}
            />
          </Box>
          <Box mb={2} sx={{ width: "100%" }}>
            <TextField
              label="Role Description"
              value={newRoleDescription}
              onChange={(e) => {
                setNewRoleDescription(e.target.value);
                if (e.target.value.length >= 250) {
                  setRoleDescriptionError(false);
                }
              }}
              fullWidth
              multiline
              rows={4}
              required
              error={roleDescriptionError}
              helperText={
                roleDescriptionError
                  ? "Role description must be at least 250 characters."
                  : ""
              }
            />
            <Typography variant="body2" color="textSecondary" align="right">
              {newRoleDescription.length}/250
            </Typography>
          </Box>
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

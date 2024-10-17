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
import "react-quill/dist/quill.snow.css"; // Import the Quill CSS for styling
import ReactQuill from "react-quill"; // Import the Quill component

const AddRole = ({ setRoles, user }) => {
  const [open, setOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [Location, setNewLocation] = useState("");
  const [CTC, setNewCTC] = useState("");
  const [roleDescriptionError, setRoleDescriptionError] = useState(false);
  const [roleNameError, setRoleNameError] = useState(false);

  const handleAddRole = async () => {
    if (newRole.trim() === "") {
      setRoleNameError(true);
      return;
    }

    const plainTextDescription = newRoleDescription.replace(
      /<\/?[^>]+(>|$)/g,
      ""
    ); // Strip HTML tags
    if (plainTextDescription.length < 250) {
      setRoleDescriptionError(true);
      return;
    }

    const newRoleData = {
      RoleTitle: newRole,
      RoleDescription: newRoleDescription,
      Location: Location,
      CTC: CTC,
    };
    try {
      await axios.post(`http://localhost:5000/add-role`, {
        username: user.username,
        role: newRoleData,
        location: Location,
        totalCTC: CTC,
      });
      setRoles();
      setNewRole("");
      setNewRoleDescription("");
      setNewLocation("");
      setNewCTC("");
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
            <Typography variant="body1" gutterBottom>
              Role Description
            </Typography>
            <ReactQuill
              theme="snow"
              value={newRoleDescription}
              onChange={(value) => {
                setNewRoleDescription(value);
                const plainText = value.replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML tags for character count
                if (plainText.length >= 250) {
                  setRoleDescriptionError(false);
                }
              }}
              placeholder="Enter role description..."
              style={{ marginBottom: "20px" }}
            />
            {roleDescriptionError && (
              <Typography color="error">
                Role description must be at least 250 characters.
              </Typography>
            )}
            <Typography variant="body2" color="textSecondary" align="right">
              {newRoleDescription.replace(/<\/?[^>]+(>|$)/g, "").length}/250
            </Typography>
          </Box>
          <Box mb={2} sx={{ width: "100%" }}>
            <TextField
              label="Location"
              value={Location}
              onChange={(e) => {
                setNewLocation(e.target.value);
              }}
              fullWidth
              required
            />
          </Box>
          <Box mb={2} sx={{ width: "100%" }}>
            <TextField
              label="Total CTC"
              value={CTC}
              onChange={(e) => {
                setNewCTC(e.target.value);
              }}
              fullWidth
              required
            />
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

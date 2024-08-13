import React, { useState } from "react";
import { Button, TextField } from "@mui/material";

const ProfileUpdate = ({ user, setDetailsExist }) => {
  const [details, setDetails] = useState({
    companyName: "",
    companyDescription: "",
    companyWebsite: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleSubmit = () => {
    // Simulate saving details to the backend
    user.details = {
      ...user.details,
      Roles: [],
    };
    setDetailsExist(true);
  };

  return (
    <div>
      <h2>Update Company Profile</h2>
      <TextField
        label="Company Name"
        name="companyName"
        value={details.companyName}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Company Description"
        name="companyDescription"
        value={details.companyDescription}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Company Website"
        name="companyWebsite"
        value={details.companyWebsite}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        style={{ marginTop: "20px" }}
      >
        Save Profile
      </Button>
    </div>
  );
};

export default ProfileUpdate;

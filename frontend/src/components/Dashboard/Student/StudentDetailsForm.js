import React, { useState } from "react";
import { Button, TextField, MenuItem } from "@mui/material";
import axios from "axios";

const StudentDetailsForm = ({ user, setDetailsExist }) => {
  const [details, setDetails] = useState({
    legalName: "",
    gender: "",
    gpa: "",
    resume: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleFileChange = (e) => {
    setDetails({ ...details, resume: e.target.files[0] });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("username", user.username);
      formData.append("legalName", details.legalName);
      formData.append("gender", details.gender);
      formData.append("gpa", details.gpa);
      formData.append("resume", details.resume);

      await axios.post("http://localhost:5000/update-details", {
        username: user.username,
        details: {
          legalName: details.legalName,
          gender: details.gender,
          gpa: details.gpa,
          resume: details.resume.name, // Assuming you want to store the filename
        },
      });

      user.details = details;
      setDetailsExist(true);
    } catch (error) {
      console.error("There was an error updating the details!", error);
    }
  };

  return (
    <div>
      <h2>Add Your Details</h2>
      <TextField
        label="Legal Name"
        name="legalName"
        value={details.legalName}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="Gender"
        name="gender"
        value={details.gender}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="male">Male</MenuItem>
        <MenuItem value="female">Female</MenuItem>
        <MenuItem value="other">Other</MenuItem>
      </TextField>
      <TextField
        label="GPA"
        name="gpa"
        value={details.gpa}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <input
        type="file"
        onChange={handleFileChange}
        style={{ marginTop: "20px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        style={{ marginTop: "20px" }}
      >
        Save Details
      </Button>
    </div>
  );
};

export default StudentDetailsForm;

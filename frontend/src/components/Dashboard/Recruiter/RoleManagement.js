import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import { AuthContext } from "../../../context/AuthContext";
import UploadJobDescription from "./UploadJobDescription";
import FetchCandidates from "./FetchCandidates";
import CandidateDataGrid from "./CandidateDataGrid";
import ConfirmDialog from "./ConfirmDialog";
import axios from "axios";
import { usePdf } from "@mikecousins/react-pdf";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const RoleManagement = ({ role, handleRoleUpdate }) => {
  const [jdDialogOpen, setJdDialogOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [jdFile, setJdFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [handleSubmit, setHandleSubmit] = useState(() => () => {});
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [page, setPage] = useState(1);
  const canvasRef = useRef(null);
  const [pdfFileUrl, setPdfFileUrl] = useState(null);
  const { pdfDocument } = usePdf({
    file: pdfFileUrl,
    page,
    canvasRef,
  });

  const handleViewJD = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/view-jd/${role.role_id}`,
        {
          responseType: "blob",
        }
      );
      const fileURL = URL.createObjectURL(new Blob([response.data]));
      setPdfFileUrl(fileURL);
      setPage(1); // Reset to the first page
      setJdDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch JD", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseJD = () => {
    setJdDialogOpen(false);
    setPdfFileUrl(null);
    setPage(1);
  };

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
    setDialogTitle("Confirm Fetch");
    setDialogContent(
      `Are you sure you want to fetch ${k} candidates? The rest will be rejected.`
    );
    setHandleSubmit(() => async () => {
      setOpenDialog(false);
      setLoading(true);
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
    });
    setOpenDialog(true);
  };

  const handleConductInterviews = () => {
    setDialogTitle("Conduct AI-assisted Interviews?");
    setDialogContent(
      "Conduct AI-assisted interviews for all the selected candidates? The rest of them will be rejected from the process."
    );
    setHandleSubmit(() => async () => {
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
    });
    setOpenDialog(true);
  };

  const handleFinishInterviews = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/finish-interviews", {
        role_id: role.role_id,
      });
      handleRoleUpdate();
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
      {role.status > 0 && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleViewJD}
          style={{ float: "right", marginBottom: "20px" }}
        >
          View JD
        </Button>
      )}
      <h2>{role.roleTitle} Role</h2>
      <h3>Description</h3>
      <Typography
        variant="body1"
        style={{ marginBottom: "20px" }}
        sx={{ "& p": { margin: "8px 0" }, "& br": { display: "none" } }}
        dangerouslySetInnerHTML={{ __html: role.roleDescription }}
      />

      <Box mt={4} mb={2}>
        <Typography variant="h6">
          {role.status === 0 && "Upload Job Description"}
          {role.status === 1 && "Fetch Candidates"}
          {(role.status === 2 || role.status === 4) && "Review Candidates"}
          {role.status === 3 && "Finish Interviews"}
        </Typography>
      </Box>
      <Divider />

      <Box mt={2} mb={4}>
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
            handleRefresh={handleRoleUpdate}
          />
        )}
        {!loading && (role.status === 2 || role.status === 4) && (
          <>
            <CandidateDataGrid
              role={role}
              setSelectedCandidates={setSelectedCandidates}
              selectedCandidates={selectedCandidates}
            />
            <Box mt={2} textAlign="center">
              <Button
                variant="contained"
                color="primary"
                disabled={selectedCandidates.length === 0} // Disable if no candidates selected
                onClick={() => {
                  if (selectedCandidates.length > 0) {
                    handleConductInterviews;
                    window.open(
                      "https://interview-ai-gold.vercel.app/dashboard",
                      "_blank" // Open in a new tab
                    );
                  } else {
                    alert("Please select candidates to conduct interviews.");
                  }
                }}
              >
                Conduct Interviews
              </Button>
            </Box>
          </>
        )}
        {!loading && role.status === 3 && (
          <Button onClick={handleFinishInterviews} color="primary">
            Finish Interviews and Generate Scores
          </Button>
        )}
      </Box>
      <ConfirmDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        dialogTitle={dialogTitle}
        dialogContent={dialogContent}
        handleSubmit={handleSubmit}
      />
      <Dialog
        open={jdDialogOpen}
        onClose={handleCloseJD}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <Box
            position="relative"
            border="1px solid #ccc"
            borderRadius="8px"
            overflow="hidden"
            height="600px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <canvas
              ref={canvasRef}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
            {page > 1 && (
              <IconButton
                onClick={() => setPage(page - 1)}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "white",
                }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
            )}
            {pdfDocument && page < pdfDocument.numPages && (
              <IconButton
                onClick={() => setPage(page + 1)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "white",
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseJD} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoleManagement;

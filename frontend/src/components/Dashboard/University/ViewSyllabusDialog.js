// ViewSyllabusDialog.js
import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SaveIcon from "@mui/icons-material/Save";
import { usePdf } from "@mikecousins/react-pdf";

const ViewSyllabusDialog = ({ open, onClose, pdfUrl }) => {
  const [page, setPage] = useState(1);
  const canvasRef = useRef(null);

  const { pdfDocument } = usePdf({
    file: pdfUrl,
    page,
    canvasRef,
  });

  const handleSavePdf = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Syllabus.pdf";
    link.click();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>View Syllabus</DialogTitle>
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
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
        <Button
          onClick={handleSavePdf}
          color="primary"
          startIcon={<SaveIcon />}
        >
          Save PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewSyllabusDialog;

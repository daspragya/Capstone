import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import CompanyDetails from "./CompanyDetails";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Grid,
  Container,
  Box,
  Button,
  Link,
  CardMedia,
} from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";

// Function to strip HTML tags and truncate text
const stripHtml = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const text = tempDiv.textContent || tempDiv.innerText || "";
  return text;
};

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

// Placeholder function for fetching logo
const getCompanyLogo = (websiteUrl) => {
  // Example: Using a service like Clearbit or a similar API
  return `https://logo.clearbit.com/${websiteUrl}`;
};

const CompanyList = ({ user }) => {
  const { refreshUserDetails } = useContext(AuthContext);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/companies");
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
    refreshUserDetails();
  }, []);

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
  };

  const handleBackToList = () => {
    fetchCompanies();
    refreshUserDetails();
    setSelectedCompany(null);
  };

  return (
    <Container sx={{ mt: 4 }}>
      {!selectedCompany ? (
        <>
          <Typography variant="h4" gutterBottom>
            Available Companies
          </Typography>
          <Grid container spacing={4}>
            {companies.map((company) => (
              <Grid item xs={12} sm={6} md={4} key={company.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardActionArea
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        pt: "100%", // Aspect ratio 1:1 for square (padding-top as percentage of width)
                        position: "relative",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={
                          getCompanyLogo(company.website) ||
                          "/default-placeholder.png"
                        }
                        alt={`${company.name} logo`}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "contain", // Ensures the logo fits inside the square without distortion
                          bgcolor: "background.paper", // Background color in case the image has transparency
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="div" gutterBottom>
                        {company.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {truncateText(stripHtml(company.description), 140)}
                      </Typography>
                      <Link
                        href={company.website}
                        target="_blank"
                        rel="noopener"
                        color="primary"
                      >
                        Visit Website
                      </Link>
                    </CardContent>
                  </CardActionArea>
                  <Box
                    sx={{
                      bgcolor: "rgba(0, 0, 0, 0.8)",
                      color: "white",
                      p: 1,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      size="small"
                      color="inherit"
                      onClick={() => handleCompanyClick(company)}
                    >
                      View More
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <CompanyDetails
          company={selectedCompany}
          onBack={handleBackToList}
          user={user}
        />
      )}
    </Container>
  );
};

export default CompanyList;

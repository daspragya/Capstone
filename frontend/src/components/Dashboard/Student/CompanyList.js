import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import CompanyDetails from "./CompanyDetails";
import {
  List,
  ListItemText,
  Divider,
  ListItemButton,
  Typography,
} from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";

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
    <div>
      {!selectedCompany ? (
        <>
          <Typography variant="h4" gutterBottom>
            Available Companies
          </Typography>
          <List>
            {companies.map((company) => (
              <React.Fragment key={company.id}>
                <ListItemButton onClick={() => handleCompanyClick(company)}>
                  <ListItemText primary={company.name} />
                </ListItemButton>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </>
      ) : (
        <CompanyDetails
          company={selectedCompany}
          onBack={handleBackToList}
          user={user}
        />
      )}
    </div>
  );
};

export default CompanyList;

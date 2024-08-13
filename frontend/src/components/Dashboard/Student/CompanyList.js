import React, { useState, useEffect } from "react";
import CompanyDetails from "./CompanyDetails";
import {
  List,
  ListItemText,
  Divider,
  ListItemButton,
  Typography,
} from "@mui/material";

const CompanyList = ({ user }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    // Simulate fetching companies from the backend
    const fetchCompanies = () => {
      return [
        {
          id: 1,
          name: "Company A",
          description: "Company A is a leading software development firm.",
          roles: [
            { id: 1, role: "Developer", jd: "JD for Developer" },
            { id: 2, role: "QA Engineer", jd: "JD for QA Engineer" },
          ],
        },
        {
          id: 2,
          name: "Company B",
          description: "Company B specializes in IT support services.",
          roles: [
            { id: 3, role: "Support Engineer", jd: "JD for Support Engineer" },
            { id: 4, role: "System Analyst", jd: "JD for System Analyst" },
          ],
        },
      ];
    };
    setCompanies(fetchCompanies());
  }, []);

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
  };

  const handleBackToList = () => {
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

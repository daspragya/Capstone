import React, { useState, useEffect } from "react";
import StudentDetailsForm from "./StudentDetailsForm";
import CompanyList from "./CompanyList";

const StudentPage = ({ user }) => {
  const isEmptyDetails = user.details.legalName === "";
  const [detailsExist, setDetailsExist] = useState(!isEmptyDetails);

  useEffect(() => {
    setDetailsExist(user.details.legalName !== "");
  }, [user.details]);

  return (
    <div>
      {!detailsExist ? (
        <StudentDetailsForm user={user} setDetailsExist={setDetailsExist} />
      ) : (
        <CompanyList user={user} />
      )}
    </div>
  );
};

export default StudentPage;

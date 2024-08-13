import React, { useState, useEffect } from "react";
import StudentDetailsForm from "./StudentDetailsForm";
import CompanyList from "./CompanyList";

const StudentPage = ({ user }) => {
  console.log(user.details);
  const isEmptyDetails = Object.keys(user.details).length === 0;

  const [detailsExist, setDetailsExist] = useState(!isEmptyDetails);

  useEffect(() => {
    setDetailsExist(Object.keys(user.details).length > 0);
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

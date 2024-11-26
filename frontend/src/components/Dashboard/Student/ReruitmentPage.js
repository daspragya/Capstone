import React, { useState, useEffect } from "react";
import StudentDetailsForm from "./StudentDetailsForm";
import CompanyList from "./CompanyList";
import ChatIcon from "@mui/icons-material/Chat";

const RecruitmentPage = ({ user }) => {
  const isEmptyDetails = user.details.legalName === "";
  const [detailsExist, setDetailsExist] = useState(!isEmptyDetails);

  useEffect(() => {
    setDetailsExist(user.details.legalName !== "");
  }, [user.details]);

  const handleChatClick = () => {
    window.openCXGenieChatWidget();
  };

  return (
    <div>
      {!detailsExist ? (
        <StudentDetailsForm user={user} setDetailsExist={setDetailsExist} />
      ) : (
        <>
          <CompanyList user={user} />
          <div onClick={handleChatClick} style={styles.chatBubble}>
            <span style={styles.chatText}>
              <ChatIcon />
            </span>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  chatBubble: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    backgroundColor: "#333", // Dark background
    color: "#fff", // White text
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
  },
  chatText: {
    fontSize: "14px",
    fontWeight: "bold",
  },
};

export default RecruitmentPage;

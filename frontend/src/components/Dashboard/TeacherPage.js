import React from "react";

const TeacherPage = ({ user }) => {
  return (
    <div>
      <h2>
        Hi {user.username}, you are a {user.role}
      </h2>
    </div>
  );
};

export default TeacherPage;

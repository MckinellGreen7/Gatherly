import React from "react";
import Auth from "../components/Auth";

const Signup: React.FC = () => {
  return (
    <Auth mode="signup" userType="user" />
  );
};

export default Signup;

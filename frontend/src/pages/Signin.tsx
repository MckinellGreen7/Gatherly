import React from "react";
import Auth from "../components/Auth";

const Signin: React.FC = () => {
  return (
    <Auth mode="signin" userType="user" />
  );
};

export default Signin;

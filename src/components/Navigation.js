import React from "react";
import { Link } from "react-router-dom";

import { authService } from "firebase-config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Navigation = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const onSignOutClick = () => {
    signOut(authService).then((user) => {
      navigate("/");
    });
  };

  const onSignInClick = () => {
    navigate("/signin");
  };

  return (
    <>
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        <Link to="/profile">my profile</Link>
      </div>
      {isLoggedIn ? (
        <button onClick={onSignOutClick}>sign out</button>
      ) : (
        <button onClick={onSignInClick}>Sign in</button>
      )}
    </>
  );
};

export default Navigation;

import React from "react";
import { Link } from "react-router-dom";

import { authService } from "firebase-config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import style from "./Navigation.module.css";

const Navigation = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const onSignOutClick = () => {
    signOut(authService).then(() => {
      navigate("/");
    });
  };

  const onSignInClick = () => {
    navigate("/signIn");
  };

  return (
    <div className={`${style.NavigationBar}`}>
      <div>
        <Link to="/postCreate">Post Create</Link>
      </div>
      <div>
        <Link to="/">Post Read</Link>
      </div>
      <div>
        <Link to="/postUpdate">Post Update</Link>
      </div>
      <div>
        <Link to="/postDelete">Post Delete</Link>
      </div>
      <div>
        <Link to="/multiUpload">Multi upload</Link>
      </div>

      {isLoggedIn ? (
        <button onClick={onSignOutClick}>sign out</button>
      ) : (
        <button onClick={onSignInClick}>Sign in</button>
      )}
    </div>
  );
};

export default Navigation;

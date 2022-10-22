import React, { useState } from "react";
import { authService } from "firebase-config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Home = ({ isLoggedIn, userObj }) => {
  const [userData, setUserObj] = useState(userObj);
  const navigate = useNavigate();

  const onSignOutClick = () => {
    signOut(authService);
  };

  const onSignInClick = () => {
    navigate("/signin");
  };

  return (
    <>
      <div>
        <div>Home</div>
        {isLoggedIn ? (
          <button onClick={onSignOutClick}>sign out</button>
        ) : (
          <button onClick={onSignInClick}>Sign in</button>
        )}
      </div>
    </>
  );
};

export default Home;

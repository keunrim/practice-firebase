import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "routes/Home";
import SignUpForm from "routes/SignUpForm";
import SignInForm from "routes/SignInForm";
import Logo from "components/logo";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";

const AppRouter = ({ isLoggedIn, userObj }) => {
  return (
    <BrowserRouter>
      <Logo />
      <Navigation isLoggedIn={isLoggedIn}></Navigation>
      <Routes>
        <Route
          path="/"
          element={<Home isLoggedIn={isLoggedIn} userObj={userObj} />}
        ></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/signin" element={<SignInForm />}></Route>
        <Route path="/signup" element={<SignUpForm />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

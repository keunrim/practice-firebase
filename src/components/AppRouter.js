import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "routes/Home";
import SignUpForm from "routes/SignUpForm";
import SignInForm from "routes/SignInForm";
import Logo from "components/logo";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";
import ImgUpload from "routes/ImgUpload";
import TextUpload from "routes/TextUpload";

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
        <Route
          path="/profile"
          element={<Profile isLoggedIn={isLoggedIn} userObj={userObj} />}
        ></Route>
        <Route
          path="/textUpload"
          element={<TextUpload isLoggedIn={isLoggedIn} userObj={userObj} />}
        ></Route>
        <Route
          path="/imageUpload"
          element={<ImgUpload isLoggedIn={isLoggedIn} userObj={userObj} />}
        ></Route>
        <Route
          path="/signin"
          element={<SignInForm isLoggedIn={isLoggedIn} />}
        ></Route>
        <Route
          path="/signup"
          element={<SignUpForm isLoggedIn={isLoggedIn} />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

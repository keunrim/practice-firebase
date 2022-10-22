import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "routes/Home";
import SignUpForm from "routes/SignUpForm";
import SignInForm from "routes/SignInForm";
import Logo from "components/logo";

const AppRouter = ({ isLoggedIn, userObj }) => {
  return (
    <BrowserRouter>
      <Logo />
      <Routes>
        <Route
          path="/"
          element={<Home isLoggedIn={isLoggedIn} userObj={userObj} />}
        ></Route>
        <Route path="/signin" element={<SignInForm />}></Route>
        <Route path="/signup" element={<SignUpForm />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

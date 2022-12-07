import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import SignUpForm from "routes/SignUpForm";
import SignInForm from "routes/SignInForm";
import Navigation from "components/Navigation";
import PostRead from "routes/PostRead";
import PostCreate from "routes/PostCreate";
import PostUpdate from "routes/PostUpdate";
import MultiUpload from "routes/MultiUpload";
import PostDelete from "routes/PostDelete";
import PostVeiw from "routes/postView";

const AppRouter = ({ isLoggedIn, userObj }) => {
  return (
    <BrowserRouter>
      <Navigation isLoggedIn={isLoggedIn}></Navigation>
      <Routes>
        <Route
          path="/"
          element={<PostRead isLoggedIn={isLoggedIn} userObj={userObj} />}
        ></Route>
        <Route
          path="/post/:linkURL"
          element={<PostVeiw isLoggedIn={isLoggedIn} userObj={userObj} />}
        ></Route>
        <Route
          path="/postCreate"
          element={<PostCreate isLoggedIn={isLoggedIn} userObj={userObj} />}
        ></Route>
        <Route
          path="/postUpdate"
          element={<PostUpdate isLoggedIn={isLoggedIn} userObj={userObj} />}
        ></Route>
        <Route
          path="/postDelete"
          element={<PostDelete isLoggedIn={isLoggedIn} userObj={userObj} />}
        ></Route>
        <Route
          path="/multiUpload"
          element={<MultiUpload isLoggedIn={isLoggedIn} userObj={userObj} />}
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

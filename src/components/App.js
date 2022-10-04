import React, { useState } from "react";
import AppRouter from "components/AppRouter";
import { authService } from "fbase";

function App() {
  // const auth = authService();
  // console.log(authService.currentUser);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>basic firebae &copy; {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;

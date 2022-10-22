import React, { useEffect, useState } from "react";
import { authService } from "firebase-config";
import { onAuthStateChanged } from "firebase/auth";

import AppRouter from "components/AppRouter";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(authService.currentUser)
  );
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
          email: user.email,
        });
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
    });
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        "loading..."
      ) : (
        <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
      )}
    </>
  );
};

export default App;

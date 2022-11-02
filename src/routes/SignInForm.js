import React, { useState } from "react";
import { authService } from "firebase-config";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { MdLogin } from "react-icons/md";
import { AiFillGoogleCircle, AiFillGithub } from "react-icons/ai";

const SignInForm = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setLoginEmail(value);
    } else if (name === "password") {
      setLoginPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await signInWithEmailAndPassword(authService, loginEmail, loginPassword)
      .then((user) => {
        user && navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSocialAuthClick = async (event) => {
    console.log("authClick");
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    await signInWithPopup(authService, provider)
      .then((user) => {
        user && navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div>
        <div>로그인 해 주세요.</div>
        <form onSubmit={onSubmit}>
          <div>
            <input
              name="email"
              type="email"
              placeholder="email"
              value={loginEmail}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="password"
              value={loginPassword}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <button type="submit">
              <MdLogin />
            </button>
          </div>
        </form>
        <div>소셜 로그인</div>
        <div>
          <button type="button" name="google" onClick={onSocialAuthClick}>
            왜?
          </button>
          <button type="button" name="github" onClick={onSocialAuthClick}>
            <AiFillGithub />
          </button>
        </div>
        <Link to="/signup">신규 가입</Link>
      </div>
    </>
  );
};

export default SignInForm;

import React, { useState } from "react";
import { authService } from "firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const navigate = useNavigate();

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setRegEmail(value);
    } else if (name === "password") {
      setRegPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await createUserWithEmailAndPassword(authService, regEmail, regPassword)
      .then((user) => {
        user && navigate("/");
      })
      .catch((error) => {
        const errorMessage = error.code;
        console.log(errorMessage);
      });
  };

  return (
    <div>
      <div>새로운 계정을 생성합니다.</div>
      <form onSubmit={onSubmit}>
        <div>
          <input
            name="email"
            type="email"
            placeholder="email"
            value={regEmail}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            name="password"
            type="password"
            placeholder="password"
            value={regPassword}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <button type="submit"></button>
        </div>
      </form>
      <Link to="/signin">로그인 화면으로 돌아가기</Link>
    </div>
  );
};

export default SignUpForm;

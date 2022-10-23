import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { authService } from "firebase-config";
import { dbService } from "firebase-config";
import { doc, setDoc } from "firebase/firestore";

const Home = ({ isLoggedIn, userObj }) => {
  const [comment, setComment] = useState("");

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setComment(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const newDoc = {
      text: comment,
      createdAt: Date.now(),
      creator: userObj.uid,
    };
    await setDoc(doc(dbService, "comments"), newDoc);
  };

  return (
    <>
      <div>
        <form onSubmit={onSubmit}>
          <input
            name="comment"
            type="text"
            value={comment}
            placeholder="입력하세요"
            maxLength={120}
            onChange={onChange}
          />
          <input name="submit" type="submit" value="전달하기" />
        </form>
      </div>
    </>
  );
};

export default Home;

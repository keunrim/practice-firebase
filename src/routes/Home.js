import React, { useEffect, useState } from "react";
import { dbService } from "firebase-config";
import {
  addDoc,
  onSnapshot,
  collection,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { MdCreate } from "react-icons/md";
import Comment from "components/Comment";

const Home = ({ isLoggedIn, userObj }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const collectionRef = collection(dbService, "comments");
    const q = query(collectionRef, orderBy("createdTime", "desc"), limit(5));
    onSnapshot(q, (snapShot) => {
      const commentsArray = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsArray);
    });
  }, []);

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
      createdTime: Date.now(),
      creator: userObj.uid,
    };
    try {
      const docRef = await addDoc(collection(dbService, "comments"), newDoc);
      console.log(docRef.path);
      setComment("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <>
      <div>
        {isLoggedIn && (
          <>
            <h4>새소식 발행</h4>
            <form onSubmit={onSubmit}>
              <input
                name="comment"
                type="text"
                value={comment}
                placeholder="입력하세요"
                maxLength={120}
                onChange={onChange}
              />
              <button type="submit">
                <MdCreate />
              </button>
            </form>
          </>
        )}
      </div>
      <h4>최신 글</h4>
      <div>
        {comments.map((commentObj) => (
          <Comment
            key={commentObj.id}
            commentObj={commentObj}
            isLoggedIn={isLoggedIn}
            userObj={userObj}
          />
        ))}
      </div>
    </>
  );
};

export default Home;

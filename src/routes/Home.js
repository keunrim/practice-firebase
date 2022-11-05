import React, { useEffect, useState, useRef } from "react";
import { dbService, storageService } from "firebase-config";
import {
  addDoc,
  onSnapshot,
  collection,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { MdCreate, MdCancel } from "react-icons/md";
import Comment from "components/Comment";

const Home = ({ isLoggedIn, userObj }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [attachment, setAttachment] = useState("");
  const attachInput = useRef(null);

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

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        target: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const clearAttachment = () => {
    setAttachment("");
    attachInput.current.value = "";
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    let attachmentURL = "";

    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentURL = await getDownloadURL(response.ref);
    }

    const newDoc = {
      comment,
      createdTime: Date.now(),
      creator: userObj.uid,
      attachmentURL,
    };

    await addDoc(collection(dbService, "comments"), newDoc).catch((reason) => {
      console.log(reason);
    });
    setComment("");
    clearAttachment();
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
              <input
                name="attachImage"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                ref={attachInput}
              />
              <button type="submit">
                <MdCreate />
              </button>
              {attachment && (
                <div>
                  <img
                    src={attachment}
                    alt="upload"
                    width="50px"
                    height="50px"
                  />
                  <button name="cancel" onClick={clearAttachment}>
                    <MdCancel />
                  </button>
                </div>
              )}
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

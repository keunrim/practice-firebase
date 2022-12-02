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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { MdCreate, MdCancel } from "react-icons/md";
import PostCard from "components/PostCard";
import Editor from "components/Editor";

import "react-quill/dist/quill.snow.css";

const Home = ({ isLoggedIn, userObj }) => {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postFile, setPostFile] = useState("");
  const [fileDownURL, setFileDownURL] = useState("");
  const [postArray, setPostArray] = useState([]);

  const postFileInput = useRef(null);

  useEffect(() => {
    const collectionRef = collection(dbService, "posts");
    const q = query(collectionRef, orderBy("createdTime", "desc"), limit(5));
    onSnapshot(q, (snapShot) => {
      const snapShotArray = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPostArray(snapShotArray);
    });
  }, []);

  const onTitleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPostTitle(value);
  };

  const onEditorChange = (value) => {
    setPostContent(value);
    console.log(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    setPostFile(theFile);
    // uploadFileGetURL();
  };

  const uploadFileGetURL = async () => {
    if (postFile !== "") {
      const storageRef = ref(
        storageService,
        `files/${userObj.uid}/${uuidv4()}_${postFile.name}`
      );
      const response = await uploadBytes(storageRef, postFile);
      const uploadURL = await getDownloadURL(response.ref);
      setFileDownURL(uploadURL);
    }
  };

  const clearPost = () => {
    setPostTitle("");
    setPostContent("");
    setPostFile("");
    setFileDownURL("");
    postFileInput.current.value = "";
  };

  const clearFile = () => {
    setPostFile("");
    setFileDownURL("");
    postFileInput.current.value = "";
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    uploadFileGetURL();

    const newDoc = {
      title: postTitle,
      content: postContent,
      createdTime: Date.now(),
      creator: userObj.uid,
      fileDownURL,
    };

    await addDoc(collection(dbService, "posts"), newDoc).catch((reason) => {
      console.log(reason);
    });
    clearPost();
  };

  return (
    <>
      <div>
        {isLoggedIn && (
          <>
            <h4>새소식 발행</h4>
            <form onSubmit={onSubmit}>
              <div style={{ marginTop: "20px" }}>
                <input
                  name="title"
                  type="text"
                  value={postTitle}
                  placeholder="제목"
                  maxLength={120}
                  onChange={onTitleChange}
                />
              </div>
              <div style={{ marginTop: "10px" }}>
                <Editor
                  postContent={postContent}
                  onEditorChange={onEditorChange}
                />
              </div>
              <div style={{ marginTop: "10px" }}>
                <input
                  name="postFile"
                  type="file"
                  accept="image/*"
                  placeholder="첨부파일"
                  onChange={onFileChange}
                  ref={postFileInput}
                />
              </div>
              <button style={{ marginTop: "20px" }} type="submit">
                <MdCreate />
                글올리기
              </button>

              {fileDownURL && (
                <div>
                  <img
                    src={fileDownURL}
                    alt="upload"
                    width="180px"
                    height="135px"
                  />
                  <button name="cancel" onClick={clearFile}>
                    <MdCancel />
                  </button>
                </div>
              )}
            </form>
          </>
        )}
      </div>
      <div style={{ marginTop: "30px" }}>
        <h4>최신 글</h4>
        <div style={{ marginTop: "10px" }}>
          {postArray.map((postObj) => (
            <PostCard
              key={postObj.id}
              postObj={postObj}
              isLoggedIn={isLoggedIn}
              userObj={userObj}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;

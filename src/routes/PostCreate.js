import React, { useState } from "react";
import { dbService } from "firebase-config";
import { addDoc, collection } from "firebase/firestore";
import Editor from "components/Editor";
import style from "./PostCreate.module.css";

const PostCreate = ({ userObj }) => {
  const [postTitle, setPostTitle] = useState("");
  const [postLinkURL, setPostLinkURL] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postEmbeded, setPostEmbeded] = useState([]);

  const onTitleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPostTitle(value);
  };

  const onLinkURLChange = (event) => {
    const {
      target: { value },
    } = event;
    setPostLinkURL(value);
  };

  const onEditorChange = (value) => {
    setPostContent(value);
  };

  const onEmbededChange = (value) => {
    setPostEmbeded(value);
  };

  const postSubmit = async (event) => {
    event.preventDefault();

    const newDoc = {
      title: postTitle,
      linkURL: postLinkURL,
      content: postContent,
      embeded: postEmbeded,
      createdTime: Date.now(),
      creator: userObj.uid,
    };

    await addDoc(collection(dbService, "posts"), newDoc)
      .then(() => {
        setPostTitle("");
        setPostLinkURL("");
        setPostContent("");
        setPostEmbeded([]);
      })
      .catch((reason) => {
        console.log(`등록 실패 : ${reason}`);
      });
  };

  return (
    <>
      <h1 style={{ marginBottom: "20px" }}>PostCreate</h1>
      <input
        className={style.postTitle}
        name="title"
        type="text"
        value={postTitle}
        placeholder="제목"
        maxLength={120}
        onChange={onTitleChange}
      />
      <input
        className={style.postTitle}
        name="linkURL"
        type="text"
        value={postLinkURL}
        placeholder="Url주소"
        maxLength={120}
        onChange={onLinkURLChange}
      />
      <Editor
        postContent={postContent}
        onEditorChange={onEditorChange}
        postEmbeded={postEmbeded}
        onEmbededChange={onEmbededChange}
        userObj={userObj}
      />
      <form onSubmit={postSubmit}>
        <button className={style.submitButton} type="submit">
          전송하기
        </button>
      </form>
    </>
  );
};

export default PostCreate;

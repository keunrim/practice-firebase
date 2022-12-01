import React, { useState } from "react";
import { dbService } from "firebase-config";
import { addDoc, collection } from "firebase/firestore";
import Editor from "components/Editor";

const TextUpload = ({ userObj }) => {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postFile, setPostFile] = useState("");
  const [fileDownURL, setFileDownURL] = useState("");

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

  const postSubmit = async (event) => {
    event.preventDefault();

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
    setPostContent("");
  };

  return (
    <>
      <form onSubmit={postSubmit}>
        <input
          style={{
            width: "650px",
            height: "40px",
            border: "1px solid #ccc",
          }}
          name="title"
          type="text"
          value={postTitle}
          placeholder="제목"
          maxLength={120}
          onChange={onTitleChange}
        />
        <Editor
          postContent={postContent}
          onEditorChange={onEditorChange}
          userObj={userObj}
        />
        <button type="submit">전송하기</button>
      </form>
    </>
  );
};

export default TextUpload;

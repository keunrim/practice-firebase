import React, { useState } from "react";
import { dbService, storageService } from "firebase-config";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Line } from "rc-progress";
import Editor from "components/Editor";

const TextUpload = ({ userObj }) => {
  const [postContent, setPostContent] = useState("");

  const onEditorChange = (value) => {
    setPostContent(value);
  };

  const postSubmit = async (event) => {
    event.preventDefault();

    const newDoc = {
      content: postContent,
      createdTime: Date.now(),
      writer: userObj.uid,
    };

    await addDoc(collection(dbService, "posts"), newDoc).catch((reason) => {
      console.log(reason);
    });
    setPostContent("");
  };

  return (
    <div>
      <form onSubmit={postSubmit}>
        <Editor postContent={postContent} onEditorChange={onEditorChange} />
        <button type="submit">전송하기</button>
      </form>
    </div>
  );
};

export default TextUpload;

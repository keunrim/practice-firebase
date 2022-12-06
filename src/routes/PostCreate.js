import React, { useState } from "react";
import { dbService } from "firebase-config";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import Editor from "components/Editor";
import style from "./PostCreate.module.css";
import { Button, message } from "antd";

const PostCreate = ({ userObj }) => {
  const [postPublished, setPostPublished] = useState(true);
  const [postLock, setPostLock] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postLinkURL, setPostLinkURL] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postEmbedImages, setPostEmbedImages] = useState([]);

  //antd
  const [messageApi, contextHolder] = message.useMessage();

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

  const onEmbedImagesChange = (value) => {
    setPostEmbedImages(value);
  };

  const postSubmit = async (event) => {
    event.preventDefault();
    if (postTitle === "") {
      messageApi.open({
        type: "error",
        content: "제목을 입력해주세요",
      });
      return;
    }
    if (postLinkURL === "") {
      messageApi.open({
        type: "error",
        content: "링크주소를 입력해주세요",
      });
      return;
    }
    if (postTitle !== "" && postLinkURL !== "") {
      const newDoc = {
        published: postPublished,
        lock: postLock,
        title: postTitle,
        linkURL: postLinkURL,
        content: postContent,
        embedImages: postEmbedImages,
        createdTime: Timestamp.fromMillis(Date.now()),
        creator: userObj.uid,
      };

      await addDoc(collection(dbService, "posts"), newDoc)
        .then(() => {
          setPostTitle("");
          setPostLinkURL("");
          setPostContent("");
          setPostEmbedImages([]);
          messageApi.open({
            type: "success",
            content: "새로운 글이 등록되었습니다.",
          });
        })
        .catch((reason) => {
          console.log(`등록 실패 : ${reason}`);
        });
    }
  };

  return (
    <>
      {contextHolder}
      <h1 style={{ marginBottom: "20px" }}>PostCreate</h1>
      <div>
        <input
          className={style.postTitle}
          name="title"
          type="text"
          value={postTitle}
          placeholder="제목"
          maxLength={120}
          onChange={onTitleChange}
        />
      </div>
      <div>
        <input
          className={style.postTitle}
          name="linkURL"
          type="text"
          value={postLinkURL}
          placeholder="링크주소"
          maxLength={120}
          onChange={onLinkURLChange}
        />
      </div>
      <Editor
        postContent={postContent}
        onEditorChange={onEditorChange}
        postEmbedImages={postEmbedImages}
        onEmbedImagesChange={onEmbedImagesChange}
        userObj={userObj}
      />
      <Button type="primary" onClick={postSubmit}>
        글 작성
      </Button>
    </>
  );
};

export default PostCreate;

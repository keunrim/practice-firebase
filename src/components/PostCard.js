import React, { useState } from "react";
import { dbService, storageService } from "firebase-config";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { MdDelete, MdEditNote, MdCreate, MdCancel } from "react-icons/md";

const PostCard = ({ postObj, isLoggedIn, userObj }) => {
  const [editing, setEditing] = useState(false);
  const [updateComment, setUpdateComment] = useState("");

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setUpdateComment(value);
  };

  const onEditing = () => {
    setUpdateComment(postObj.content);
    setEditing(true);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateDoc(doc(dbService, "posts", postObj.id), {
        content: updateComment,
      });
      setEditing(false);
      setUpdateComment("");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const onCancel = (event) => {
    setEditing(false);
    setUpdateComment("");
  };

  const onDelete = async (event) => {
    await deleteDoc(doc(dbService, "posts", postObj.id));
    if (postObj.fileDownURL !== "") {
      const fileDownURL = ref(storageService, postObj.fileDownURL);
      await deleteObject(fileDownURL);
    }
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              name="updateComment"
              type="text"
              value={updateComment}
              maxLength={120}
              required
              onChange={onChange}
            ></input>
            <button type="submit">
              <MdCreate />
            </button>
            <button type="button" onClick={onCancel}>
              <MdCancel />
            </button>
          </form>
        </>
      ) : (
        <>
          {postObj.fileDownURL && (
            <div>
              <img
                src={postObj.fileDownURL}
                width="180px"
                height="135px"
                alt="글이미지"
              />
            </div>
          )}
          <div style={{ width: "400px", border: "1px solid gray" }}>
            <div className="postTitle NanumSquare">
              <h1>{postObj.title}</h1>
            </div>
            <div
              className="postContent ql-editor"
              style={{ maxHeight: 200, overflowY: "scroll", marginTop: 10 }}
              dangerouslySetInnerHTML={{ __html: postObj.content }}
            />
            {isLoggedIn && (
              <>
                {postObj.creator === userObj.uid && (
                  <div style={{ marginTop: "10px" }}>
                    <button type="button" onClick={onEditing}>
                      <MdEditNote />
                    </button>
                    <button type="button" onClick={onDelete}>
                      <MdDelete />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PostCard;

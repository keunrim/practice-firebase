import React, { useState } from "react";
import { dbService, storageService } from "firebase-config";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { MdDelete, MdEditNote, MdCreate, MdCancel } from "react-icons/md";

const Comment = ({ commentObj, isLoggedIn, userObj }) => {
  const [editing, setEditing] = useState(false);
  const [updateComment, setUpdateComment] = useState("");

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setUpdateComment(value);
  };

  const onEditing = () => {
    setUpdateComment(commentObj.comment);
    setEditing(true);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateDoc(doc(dbService, "comments", commentObj.id), {
        comment: updateComment,
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
    await deleteDoc(doc(dbService, "comments", commentObj.id));
    if (commentObj.attachmentURL !== "") {
      const attachmentURL = ref(storageService, commentObj.attachmentURL);
      await deleteObject(attachmentURL);
    }
  };

  return (
    <div>
      <span>
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
            {commentObj.attachmentURL && (
              <div>
                <img
                  src={commentObj.attachmentURL}
                  width="180px"
                  height="135px"
                  alt="글이미지"
                />
              </div>
            )}
            <div>{commentObj.comment}</div>
            {isLoggedIn && (
              <>
                {commentObj.creator === userObj.uid && (
                  <div>
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
          </>
        )}
      </span>
    </div>
  );
};

export default Comment;

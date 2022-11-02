import React, { useState } from "react";
import { dbService } from "firebase-config";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
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

  const onEditing = (event) => {
    setUpdateComment(commentObj.text);
    setEditing(true);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateDoc(doc(dbService, "comments", commentObj.id), {
        text: updateComment,
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
    try {
      await deleteDoc(doc(dbService, "comments", commentObj.id));
    } catch (error) {
      console.error("Error deletting document: ", error);
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
            {commentObj.text}
            {isLoggedIn && (
              <>
                {commentObj.creator === userObj.uid && (
                  <>
                    <button type="button" onClick={onEditing}>
                      <MdEditNote />
                    </button>
                    <button type="button" onClick={onDelete}>
                      <MdDelete />
                    </button>
                  </>
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

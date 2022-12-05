import React, { useEffect, useState } from "react";
import { dbService } from "firebase-config";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Comment from "components/Comment";

const Profile = ({ isLoggedIn, userObj }) => {
  const [myComments, setMyComments] = useState([]);

  const getMyComments = async () => {
    if (isLoggedIn) {
      const collectionRef = collection(dbService, "posts");
      const q = query(
        collectionRef,
        orderBy("createdTime", "desc"),
        where("creator", "==", `${userObj.uid}`)
      );
      const dataSnapShot = await getDocs(q);
      const data = dataSnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyComments(data);
    }
  };

  useEffect(() => {
    getMyComments();
  }, [isLoggedIn]);

  return (
    <>
      {isLoggedIn ? (
        <div>
          <h4>My Profile</h4>
          <div>
            <img src={userObj.photoURL} alt="profile" /> {userObj.displayName}
          </div>
          <h4>My Comments</h4>
          {myComments.map((commentObj) => (
            <Comment
              key={commentObj.id}
              commentObj={commentObj}
              isLoggedIn={isLoggedIn}
              userObj={userObj}
            />
          ))}
        </div>
      ) : (
        <div>로그인이 필요합니다.</div>
      )}
    </>
  );
};

export default Profile;

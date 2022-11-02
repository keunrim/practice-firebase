import React from "react";

const Profile = ({ isLoggedIn, userObj }) => {
  return (
    <>
      <h4>계정 관리</h4>
      {isLoggedIn ? <div>My Profile</div> : <div>로그인이 필요합니다.</div>}
    </>
  );
};

export default Profile;

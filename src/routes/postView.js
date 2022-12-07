import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

const PostVeiw = () => {
  const location = useLocation();
  const { linkURL } = useParams();
  const [post, setPost] = useState({});

  useEffect(() => {
    const postTemp = location.state;
    setPost(postTemp);
  }, []);

  return (
    <>
      <h1>PostVeiw</h1>
      <div style={{ width: "760px" }}>
        <div className="postTitle NanumSquare">
          <h1>{post.title}</h1>
        </div>
        <div
          className={"ql-editor"}
          style={{
            maxWidth: 760,
            marginTop: 10,
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </>
  );
};

export default PostVeiw;

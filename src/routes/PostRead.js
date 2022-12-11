import React, { useEffect, useState } from "react";
import { dbService } from "firebase-config";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  getCountFromServer,
  startAfter,
  endBefore,
  limitToLast,
  where,
} from "firebase/firestore";
import { Link } from "react-router-dom";

const PostRead = () => {
  const collectionRef = collection(dbService, "posts");
  const pageSize = 3;

  const [posts, setPosts] = useState([]);
  const [startPost, setStartPost] = useState(null);
  const [endPost, setEndPost] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const getPosts = async () => {
      const q = query(
        collectionRef,
        orderBy("createdTime", "desc"),
        where("published", "==", true),
        limit(pageSize)
      );
      const dataSnap = await getDocs(q);
      const data = dataSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
      const startPostSnap = dataSnap.docs[0];
      setStartPost(startPostSnap);
      const endPostSnap = dataSnap.docs[dataSnap.docs.length - 1];
      setEndPost(endPostSnap);
    };

    //전체 포스팅 수 집계
    const getTotalPosts = async () => {
      const query_ = query(collectionRef, where("published", "==", true));
      const snapshot = await getCountFromServer(query_);
      const totalCount = snapshot.data().count;
      const nPages = Math.ceil(totalCount / pageSize);
      setTotalPosts(totalCount);
      setTotalPages(nPages);
    };

    getPosts();
    getTotalPosts();
  }, []);

  const onPrevClick = async () => {
    if (currentPage > 1) {
      const q = query(
        collectionRef,
        orderBy("createdTime", "desc"),
        endBefore(startPost),
        where("published", "==", true),
        limitToLast(pageSize)
      );
      const dataSnap = await getDocs(q);
      const data = dataSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
      const startPostSnap = dataSnap.docs[0];
      setStartPost(startPostSnap);
      const endPostSnap = dataSnap.docs[dataSnap.docs.length - 1];
      setEndPost(endPostSnap);
      setCurrentPage(currentPage - 1);
    }
  };

  const onNextClick = async () => {
    if (currentPage < totalPages) {
      const q = query(
        collectionRef,
        orderBy("createdTime", "desc"),
        startAfter(endPost),
        where("published", "==", true),
        limit(pageSize)
      );
      const dataSnap = await getDocs(q);
      const data = dataSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
      const startPostSnap = dataSnap.docs[0];
      setStartPost(startPostSnap);
      const endPostSnap = dataSnap.docs[dataSnap.docs.length - 1];
      setEndPost(endPostSnap);
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <h1>PostRead</h1>
      <div>
        {posts.map((post) => (
          <Link key={post.id} to={`/post/${post.linkURL}`} state={post}>
            <div style={{ marginTop: "20px" }}>
              <h2>{post.title}</h2>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ marginTop: 20 }}>
        <button type="button" onClick={onPrevClick}>
          {"<"}
        </button>
        <span style={{ margin: "0px 10px" }}>
          {currentPage} / {totalPages}
        </span>
        <button type="button" onClick={onNextClick}>
          {">"}
        </button>
      </div>
    </>
  );
};

export default PostRead;

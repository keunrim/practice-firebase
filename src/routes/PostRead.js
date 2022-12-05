import React, { useEffect, useState } from "react";
import { dbService } from "firebase-config";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
  endBefore,
  limitToLast,
} from "firebase/firestore";

import { Pagination } from "antd";

const PostRead = () => {
  const collectionRef = collection(dbService, "posts");

  const [posts, setPosts] = useState([]);
  const [startPost, setStartPost] = useState(null);
  const [endPost, setEndPost] = useState(null);

  const [pageSize, setPageSize] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const getPosts = async () => {
      const q = query(
        collectionRef,
        orderBy("createdTime", "desc"),
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

    const getTotalPosts = async () => {
      const query_ = query(collectionRef);
      const snapshot = await getCountFromServer(query_);
      setTotalPosts(snapshot.data().count);
      const total = Math.ceil(totalPosts / pageSize);
      setTotalPages(total);
    };
    getPosts();
    getTotalPosts();
  }, []);

  const getNext = async () => {
    const q = query(
      collectionRef,
      orderBy("createdTime", "desc"),
      startAfter(endPost),
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

  const getPrev = async () => {
    const q = query(
      collectionRef,
      orderBy("createdTime", "desc"),
      endBefore(startPost),
      limitToLast(pageSize)
    );
    const dataSnap = await getDocs(q);
    const data = dataSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPosts(data);
    const startPostSnap = dataSnap.docs[0];
    setStartPost(startPostSnap);
    const endPostSnap = dataSnap.docs[dataSnap.docs.length - 1];
    setEndPost(endPostSnap);
  };

  const handleChange = (page) => {
    if (page > currentPage) {
      console.log("next");
      getNext();
    } else if (page < currentPage) {
      console.log("prev");
      getPrev();
    }
    setCurrentPage(page);
  };

  return (
    <>
      <h1>PostRead</h1>
      <div>
        {posts.map((post) => (
          <div key={post.id} style={{ marginTop: "20px" }}>
            <h2>{post.title}</h2>
          </div>
        ))}
      </div>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalPosts}
        onChange={handleChange}
      />
    </>
  );
};

export default PostRead;

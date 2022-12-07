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
  Timestamp,
} from "firebase/firestore";

//antd
import { DatePicker } from "antd";
import "dayjs/locale/ko";
import locale from "antd/es/date-picker/locale/en_US";
const { RangePicker } = DatePicker;

const PostRead = () => {
  const collectionRef = collection(dbService, "posts");
  const pageSize = 3;

  const [posts, setPosts] = useState([]);
  const [startPost, setStartPost] = useState(null);
  const [endPost, setEndPost] = useState(null);

  // const [pageSize, setPageSize] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  // const [totalPages, setTotalPages] = useState(0);

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

    //전체 포스팅 수 집계
    const getTotalPosts = async () => {
      const query_ = query(collectionRef);
      const snapshot = await getCountFromServer(query_);
      setTotalPosts(snapshot.data().count);
    };
    getPosts();
    getTotalPosts();
  }, []);

  const handleChange = (page) => {
    if (page > currentPage) {
      console.log("next");
    } else if (page < currentPage) {
      console.log("prev");
    }
    setCurrentPage(page);
  };

  return (
    <>
      <h1>PostRead</h1>
      <RangePicker locale={locale} />
      <div>
        {posts.map((post) => (
          <div key={post.id} style={{ marginTop: "20px" }}>
            <h2>{post.title}</h2>
          </div>
        ))}
      </div>
    </>
  );
};

export default PostRead;

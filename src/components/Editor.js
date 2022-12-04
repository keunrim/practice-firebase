import React, { useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

import { storageService } from "firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { Line } from "rc-progress";

var Block = Quill.import("blots/block");
Block.tagName = "DIV";
Quill.register(Block, true);

const Editor = ({ postContent, onEditorChange }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      [{ align: [] }, { color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "color",
    "background",
  ];

  const quillRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false);
  const [embeddedURL, setEmbeddedURL] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleImage = () => {
      // 파일을 업로드 하기 위한 input 태그 생성
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      // 파일이 input 태그에 담기면 실행 될 함수
      input.onchange = async () => {
        setIsUploading(true);
        const promises = [];

        if (input.files && input.files.length > 0) {
          const file = input.files[0];
          const storageRef = ref(
            storageService,
            `images/${uuidv4()}_${file.name}`
          );
          const uploadTask = uploadBytesResumable(storageRef, file);
          promises.push(uploadTask);

          //업로드 상태 관리
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setProgress(progress);
              console.log("Upload is " + progress + "% done");

              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
                case "success":
                  console.log("Upload is success");
                  break;
                default:
                  break;
              }
            },
            //에러 처리
            (error) => {
              switch (error.code) {
                case "storage/unauthorized":
                  // User doesn't have permission to access the object
                  break;
                case "storage/canceled":
                  // User canceled the upload
                  break;
                case "storage/unknown":
                  // Unknown error occurred, inspect error.serverResponse
                  break;
                default:
                  break;
              }
            },
            async () => {
              await getDownloadURL(uploadTask.snapshot.ref).then(
                (downloadURL) => {
                  imageInsert(downloadURL);
                  setEmbeddedURL((prev) => [...prev, downloadURL]);
                  console.log("File available at", downloadURL);
                }
              );
            }
          );
        }

        await Promise.all(promises)
          .then(() => {
            setIsUploading(false);
            setProgress(0);
          })
          .catch((error) => console.log(error));
      };
    };

    if (quillRef.current) {
      const toolbar = quillRef.current.getEditor().getModule("toolbar");
      toolbar.addHandler("image", handleImage);
    }
  }, []);

  const imageInsert = (downloadURL) => {
    const range = quillRef.current?.getEditor().getSelection()?.index;
    if (range !== null && range !== undefined) {
      let quill = quillRef.current?.getEditor();

      quill?.setSelection(range, 1);

      quill?.clipboard.dangerouslyPasteHTML(
        range,
        `<img src=${downloadURL} alt="임베드 이미지" width="100%" />`
      );
    }
  };

  return (
    <>
      <ReactQuill
        style={{ width: "650px" }}
        theme="snow"
        modules={modules}
        formats={formats}
        value={postContent}
        onChange={onEditorChange}
        ref={quillRef}
        preserveWhitespace
      />
      <div>
        <Line
          style={{ width: "650px" }}
          percent={progress}
          strokeWidth={0.5}
          strokeColor="#ff567a"
        />
      </div>
    </>
  );
};

export default Editor;

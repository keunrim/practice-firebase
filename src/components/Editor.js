import React, { useEffect, useRef, useState } from "react";
import { storageService } from "firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

import { v4 as uuidv4 } from "uuid";
import { Line } from "rc-progress";

import "./Editor.css";

//<p>태그를 <div>태그로 변경
var Block = Quill.import("blots/block");
Block.tagName = "DIV";
Quill.register(Block, true);

const Editor = ({
  postContent,
  onEditorChange,
  postEmbedImages,
  onEmbedImagesChange,
  userObj,
}) => {
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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setHandler();
  }, []);

  const setHandler = () => {
    if (quillRef.current) {
      const toolbar = quillRef.current.getEditor().getModule("toolbar");
      toolbar.addHandler("image", handleImage);
    }
  };

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

      // 여기서 isUploading 상태가 false이다.
      // 나중에 다시 보자
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        const storageRef = ref(
          storageService,
          `posts/embedImages/${uuidv4()}_${file.name}`
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
                onEmbedImagesChange((prev) => [...prev, downloadURL]);
                console.log("파일 업로드 완료 : ", downloadURL);
              }
            );
          }
        );
      }

      await Promise.all(promises)
        .then((response) => {
          setIsUploading(false);
          setProgress(0);
          console.log(`업로드 프로세스 완료 : ${response}`);
        })
        .catch((error) => console.log(`에러발생 : ${error}`));
    };
  };

  const imageInsert = (downloadURL) => {
    const range = quillRef.current?.getEditor().getSelection()?.index;
    if (range !== null && range !== undefined) {
      let quill = quillRef.current?.getEditor();

      quill?.setSelection(range, 1);

      quill?.clipboard.dangerouslyPasteHTML(
        range,
        `<img src=${downloadURL} />`
      );
    }
  };

  return (
    <>
      <ReactQuill
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
          style={{ width: "760px" }}
          percent={progress}
          strokeWidth={0.5}
          strokeColor="#ff567a"
        />
      </div>
    </>
  );
};

export default Editor;

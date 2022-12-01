import React, { useRef, useState } from "react";
import { storageService } from "firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { Line } from "rc-progress";

const ImgUpload = ({ userObj }) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState([]);
  const [progress, setProgress] = useState(0);
  const attachInput = useRef(null);

  const clearFiles = () => {
    setFiles([]);
    attachInput.current.value = "";
  };

  const onFileChange = (event) => {
    for (const imageFile of event.target.files) {
      setFiles((prev) => [...prev, imageFile]);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true);

    const promises = [];

    files?.map((file) => {
      const storageRef = ref(storageService, `images/${uuidv4()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      promises.push(uploadTask);

      //업로드 상태 관리
      // Listen for state changes, errors, and completion of the upload.
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
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
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
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setPhotoURL((prev) => [...prev, downloadURL]);
            // console.log("File available at", downloadURL);
          });
        }
      );
    });

    await Promise.all(promises)
      .then(() => {
        setIsUploading(false);
        setProgress(0);
        clearFiles();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div style={{ marginTop: "50px" }}>
      <Line percent={progress} strokeWidth={1} strokeColor="#ff567a" />
      <form onSubmit={onSubmit}>
        <input
          multiple
          name="attachInput"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={attachInput}
        />
        <button type="submit">{isUploading ? "전송중" : "전송"}</button>
      </form>
      {files?.length > 0 &&
        files.map((file, index) => <div key={index}>{file.name}</div>)}
      {photoURL?.length > 0 && (
        <ul>
          {photoURL.map((url, index) => (
            <li key={index}>
              <img src={url} alt="사용자 첨부 이미지" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ImgUpload;

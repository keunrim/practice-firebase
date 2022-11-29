import React, { useRef, useState } from "react";
import { storageService } from "firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const ImgUpload = ({ userObj }) => {
  const [file, setFile] = useState(null);
  const attachInput = useRef(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    let downloadURL = "";
    const storageRef = ref(
      storageService,
      `images/${userObj.uid}/${uuidv4()}_${file.name}`
    );

    const response = await uploadBytes(storageRef, file);
    downloadURL = await getDownloadURL(response.ref);
    console.log(downloadURL);
    clearAttachment();
  };

  const clearAttachment = () => {
    setFile(null);
    attachInput.current.value = "";
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    setFile(theFile);
  };

  return (
    <div style={{ marginTop: "50px" }}>
      <form onSubmit={onSubmit}>
        <input
          name="attachImage"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={attachInput}
        />
        <button type="submit">전송하기</button>
      </form>
    </div>
  );
};

export default ImgUpload;

import React, { useState } from "react";
import { uploadFile, deleteFile } from "react-s3";

const S3_BUCKET = "questlog-images";
const REGION = "us-east-2";
const ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;

const config = {
  bucketName: S3_BUCKET,
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
};

const UploadImageToS3WithReactS3 = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileNameInput = (e) => {
    setFileName(fileName);
  };

  const handleUpload = async (file) => {
    uploadFile(file, config)
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  };

  const handleRemove = async (file) => {
    deleteFile(fileName, config)
    .then(response => console.log(response))
    .catch(err => console.error(err))
  };

  return (
    <div>
      <h5>React S3 File Upload</h5>
      <input type="file" onChange={handleFileInput} />
      <button onClick={() => handleUpload(selectedFile)}>Upload to S3</button>

      <h5>React S3 File Removal</h5>
      <input type="text" onChange={handleFileNameInput} />
      <button onClick={() => handleRemove(fileName)}>Remove from S3</button>
    </div>
  );
};

export default UploadImageToS3WithReactS3;

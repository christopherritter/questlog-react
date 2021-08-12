import React, { useState, useContext } from "react";
import { uploadFile, deleteFile } from "react-s3";

import Button from "@material-ui/core/Button";

import QuestContext from "../../contexts/QuestContext.jsx";

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

const UploadImageToS3WithReactS3 = (props) => {
  const { quest } = useContext(QuestContext);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (file) => {
    uploadFile(file, config)
      .then((data) => {
        var key = data.key;
        props.onUpload(key);
      })
      .catch((err) => console.error(err));
  };

  const handleRemove = () => {
    deleteFile(quest.image, config)
      .then((result) => props.onRemove())
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h5>Cover Art</h5>
      <Button
        variant="contained"
        component="label"
      >
        Select File
        <input
          type="file"
          hidden
          onChange={handleFileInput}
        />
      </Button>
      <Button variant="contained" onClick={() => handleUpload(selectedFile)}>Upload to S3</Button>
      {quest.image.length > 0 && (
        <Button variant="contained" onClick={handleRemove}>Remove Cover Art</Button>
      )}
    </div>
  );
};

export default UploadImageToS3WithReactS3;

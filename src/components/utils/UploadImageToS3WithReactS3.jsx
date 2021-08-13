import React, { useState, useContext } from "react";
import { uploadFile, deleteFile } from "react-s3";

import Grid from "@material-ui/core/Grid";
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
    <Grid container>
      <Grid item sm={12}>
        <h5>Cover Art</h5>
      </Grid>

      {quest.image.length > 0 && (
        <>
          <Grid item sm={6}>
            <img src={'https://questlog-images.s3.us-east-2.amazonaws.com/' + quest.image} alt="Cover art" width="100%" />
          </Grid>
          <Grid item sm={6}>
            <Button variant="contained" onClick={handleRemove}>Remove Cover Art</Button>
          </Grid>
        </>
      )}

      <Grid item sm={12}>
        <Button
          variant="contained"
          component="label"
        >
          { quest.image.length > 0 ? "Change Cover Art" : "Upload Cover Art" }
          <input
            type="file"
            hidden
            onChange={handleFileInput}
          />
        </Button>
        <Button variant="contained" onClick={() => handleUpload(selectedFile)}>Upload to S3</Button>
      </Grid>

    </Grid>
  );
};

export default UploadImageToS3WithReactS3;

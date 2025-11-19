import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import axios from "axios";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f)); // create preview
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/predict", formData);
      setResult(`Prediction: ${res.data.class_name}`);
    } catch (err) {
      console.error(err);
      setResult("Error predicting");
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setResult("");
    document.getElementById("file-input").value = ""; // reset file input
  };

  return (
    <div style={{ padding: "20px" }}>
      <input id="file-input" type="file" onChange={handleFileChange} />
      
      {preview && (
        <div style={{ marginTop: "10px" }}>
          <img
            src={preview}
            alt="preview"
            style={{ width: "200px", border: "1px solid #444" }}
          />
        </div>
      )}

      <div style={{ marginTop: "10px" }}>
        <Button variant="contained" onClick={handleUpload} sx={{ mr: 1 }}>
          Predict
        </Button>
        <Button variant="outlined" onClick={handleClear}>
          Clear
        </Button>
      </div>

      <Typography mt={2}>{result}</Typography>
    </div>
  );
}

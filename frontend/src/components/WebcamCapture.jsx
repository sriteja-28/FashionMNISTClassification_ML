import { useRef, useState, useEffect } from "react";
import { Button } from "@mui/material";
import axios from "axios";

export default function CameraCapture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [isCaptured, setIsCaptured] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [liveMode, setLiveMode] = useState(false);
  const [liveResult, setLiveResult] = useState("");
  const [cameraOn, setCameraOn] = useState(false);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setCameraOn(true);
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    videoRef.current.srcObject = null;
    setCameraOn(false);
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const data = canvas.toDataURL("image/png");
    setImageData(data);
    setIsCaptured(true);
  };

  const retake = () => {
    setIsCaptured(false);
  };

  const predictOnce = async () => {
    const blob = await fetch(imageData).then(r => r.blob());
    const formData = new FormData();
    formData.append("file", blob, "frame.png");

    try {
      const res = await axios.post("http://localhost:5000/predict", formData);
      alert(`Prediction: ${res.data.class_name}`);
    } catch (err) {
      console.error(err);
      alert("prediction failed");
    }
  };

  const predictLive = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const data = canvas.toDataURL("image/png");
    const blob = await fetch(data).then(r => r.blob());
    const formData = new FormData();
    formData.append("file", blob, "frame.png");

    try {
      const res = await axios.post("http://localhost:5000/predict", formData);
      setLiveResult(res.data.class_name);
    } catch (err) {
      console.error(err);
      setLiveResult("error");
    }
  };

  useEffect(() => {
    let interval;

    if (liveMode) {
      interval = setInterval(() => {
        predictLive();
      }, 700);
    }

    return () => clearInterval(interval);
  }, [liveMode]);

  const toggleLive = () => {
    if (!cameraOn) return alert("start camera first");
    setLiveMode(prev => !prev);
    setIsCaptured(false);
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Button onClick={startCamera}>start camera</Button>
        <Button onClick={stopCamera}>stop camera</Button>
        <Button onClick={toggleLive}>
          {liveMode ? "stop live" : "start live"}
        </Button>
      </div>

      {!isCaptured && (
        <div>
          <video
            ref={videoRef}
            autoPlay
            style={{ width: "300px", border: "1px solid #444" }}
          />
          {!liveMode && cameraOn && (
            <Button onClick={captureFrame}>capture</Button>
          )}
        </div>
      )}

      {isCaptured && !liveMode && (
        <div>
          <img
            src={imageData}
            alt="captured"
            style={{ width: "300px", border: "1px solid #444" }}
          />
          <Button onClick={retake}>retake</Button>
          <Button onClick={predictOnce}>predict</Button>
        </div>
      )}

      {liveMode && (
        <div style={{ marginTop: "10px", fontSize: "20px" }}>
          live result: <b>{liveResult}</b>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

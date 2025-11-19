import React from "react";
import UploadForm from "./components/UploadForm";
import WebcamCapture from "./components/WebcamCapture";
import { Container, Typography, Paper, Box } from "@mui/material";

function App() {
  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Fashion MNIST Classifier
        </Typography>

        <Box sx={{ mt: 3 }}>
          <UploadForm />
        </Box>

        {/* Uncomment if using webcam */}
        {/* <Box sx={{ mt: 4 }}>
          <WebcamCapture />
        </Box> */}
      </Paper>
    </Container>
  );
}

export default App;

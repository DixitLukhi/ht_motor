import React, { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function Testing() {

    const navigate = useNavigate();

    const [results, setResults] = useState(null);

  const handleUpload = () => {
    // Simulate data processing and set results
    setTimeout(() => {
      setResults("Sample results: Passed");
    }, 2000);
  };

  return (
    <>
      <Container maxWidth="lg">
        <Button variant="contained" color="primary" onClick={() => navigate("/")}>
          Home
        </Button>
        <Typography variant="h4" align="center" gutterBottom>
          HT Motor Testing Dashboard
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              style={{ padding: "20px", textAlign: "center" }}
            >
              Voltage Test
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              style={{ padding: "20px", textAlign: "center" }}
            >
              Current Test
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              style={{ padding: "20px", textAlign: "center" }}
            >
              Temperature Test
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              style={{ padding: "20px", textAlign: "center" }}
            >
              Efficiency Test
            </Paper>
          </Grid>
        </Grid>
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Button variant="contained" color="primary" onClick={handleUpload}>
            Upload Data
          </Button>
        </div>
        {results && (
          <Paper
            elevation={3}
            style={{ padding: "20px", marginTop: "20px", textAlign: "center" }}
          >
            Results: {results}
          </Paper>
        )}
      </Container>
    </>
  );
}

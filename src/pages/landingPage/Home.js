import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {

  const navigate = useNavigate();

  return (
    <>
      <div className="container">
      <Button variant="contained" color="primary" onClick={() => navigate("/test")}>
        Test
      </Button>
        <div className="title">HT Motor Testing</div>
        <div className="partitions">
          <div className="partition">Test 1: Voltage</div>
          <div className="partition">Test 2: Current</div>
          <div className="partition">Test 3: Temperature</div>
          <div className="partition">Test 4: Efficiency</div>
        </div>
      </div>
    </>
  );
}

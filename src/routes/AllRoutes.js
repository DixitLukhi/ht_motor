import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/landingPage/Home";
import PageNotFound from "../pages/pageNotFound/PageNotFound";
import Testing from "../pages/landingPage/Testing";

function AllRoutes() {
  return (
    <BrowserRouter>
      <Routes className="main min-h-screen h-ful w-full">
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="test" element={<Testing />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AllRoutes;

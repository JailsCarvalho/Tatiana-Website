import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import SmoothScroll from "@/components/SmoothScroll";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Sobre from "@/pages/Sobre";
import Workshops from "@/pages/Workshops";
import Aulas from "@/pages/Aulas";
import Blog from "@/pages/Blog";

function App() {
  return (
    <div className="App grain">
      <SmoothScroll />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/aulas" element={<Aulas />} />
            <Route path="/blog" element={<Blog />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#000",
            color: "#fff",
            border: "1px solid #000",
            borderRadius: 0,
            fontFamily: "Manrope, sans-serif",
            fontSize: "12px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          },
        }}
      />
    </div>
  );
}

export default App;

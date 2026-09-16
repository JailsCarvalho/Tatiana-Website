import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import SmoothScroll from "@/components/SmoothScroll";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Sobre from "@/pages/Sobre";
import Workshops from "@/pages/Workshops";
import Aulas from "@/pages/Aulas";
import Blog from "@/pages/Blog";
import AdminRoot from "@/components/admin/AdminRoot";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import WorkshopsList from "@/pages/admin/WorkshopsList";
import WorkshopEditor from "@/pages/admin/WorkshopEditor";
import BlogList from "@/pages/admin/BlogList";
import BlogEditor from "@/pages/admin/BlogEditor";

// O scroll suave (Lenis) pertence às páginas editoriais; no painel atrapalha
// formulários e listas longas, por isso não é montado em /admin.
function PublicSmoothScroll() {
  const { pathname } = useLocation();
  return pathname.startsWith("/admin") ? null : <SmoothScroll />;
}

function App() {
  return (
    <div className="App grain">
      <BrowserRouter>
        <PublicSmoothScroll />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/aulas" element={<Aulas />} />
            <Route path="/blog" element={<Blog />} />
          </Route>

          <Route element={<AdminRoot />}>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="workshops" element={<WorkshopsList />} />
                <Route path="workshops/novo" element={<WorkshopEditor />} />
                <Route path="workshops/:id" element={<WorkshopEditor />} />
                <Route path="blog" element={<BlogList />} />
                <Route path="blog/novo" element={<BlogEditor />} />
                <Route path="blog/:id" element={<BlogEditor />} />
              </Route>
            </Route>
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

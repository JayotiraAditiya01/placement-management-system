import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

// ✅ FIXED IMPORTS (NO .jsx)
import Home from "./pages/Home";
import Contact from "./pages/Contact";

// Student
import StudentLogin from "./pages/student/StudentLogin";
import StudentDashboard from "./pages/student/StudentDashboard";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Developer
import DeveloperLogin from "./pages/developer/DeveloperLogin";
import DeveloperDashboard from "./pages/developer/DeveloperDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />

        {/* STUDENT */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* DEVELOPER */}
        <Route path="/developer/login" element={<DeveloperLogin />} />
        <Route
          path="/developer/dashboard"
          element={
            <ProtectedRoute role="DEVELOPER">
              <DeveloperDashboard />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
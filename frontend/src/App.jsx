import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateTest from "./pages/CreateTest";
import MainLayout from "./layout/MainLayout";
import AddQuestions from "./pages/AddQuestion";
import PublishTest from "./pages/PublishTest";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tests/create" element={<CreateTest />} />
          <Route path="/tests/:testId/edit" element={<CreateTest />} />
          <Route
            path="/tests/:testId/add-questions"
            element={<AddQuestions />}
          />
          <Route path="/tests/:testId/publish" element={<PublishTest />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

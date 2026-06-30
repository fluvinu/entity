import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import EntityExplorer from "./pages/EntityExplorer";
import EntityEditor from "./pages/EntityEditor";
import EntityDetail from "./pages/EntityDetail";
import GraphViewer from "./pages/GraphViewer";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import TasksPage from "./pages/TasksPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/entities" element={<EntityExplorer />} />
        <Route path="/entities/new" element={<EntityEditor />} />
        <Route path="/entities/:id" element={<EntityDetail />} />
        <Route path="/entities/:id/edit" element={<EntityEditor />} />
        <Route path="/graph" element={<GraphViewer />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

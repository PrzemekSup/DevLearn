import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProgressProvider } from "./contexts/ProgressContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import ArticlePage from "./pages/ArticlePage";
import PathsPage from "./pages/PathsPage";
import CoursePage from "./pages/CoursePage";
import LessonPage from "./pages/LessonPage";
import TaskPage from "./pages/TaskPage";
import ProfilePage from "./pages/ProfilePage";
import UserDashboard from "./modules/dashboards/UserDashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Login } from "./modules/profile/Login";
import { ApiClientProvider } from "./contexts/ApiClientContext";
import { Register } from "./modules/profile/Register";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ApiClientProvider>
          <ProgressProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:id" element={<ArticlePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/paths" element={<PathsPage />} />
                  <Route path="/course/:pathId" element={<CoursePage />} />
                  <Route path="/lesson/:lessonId" element={<LessonPage />} />
                  <Route path="/task/:taskId" element={<TaskPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </div>
            </Router>
          </ProgressProvider>
        </ApiClientProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

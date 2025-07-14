import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProgressProvider } from "./contexts/ProgressContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import ArticlePage from "./pages/ArticlePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PathsPage from "./pages/PathsPage";
import CoursePage from "./pages/CoursePage";
import LessonPage from "./pages/LessonPage";
import TaskPage from "./pages/TaskPage";
import ProfilePage from "./pages/ProfilePage";
import UserDashboard from "./modules/dashboards/UserDashboard";

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<ArticlePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
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
    </AuthProvider>
  );
}

export default App;

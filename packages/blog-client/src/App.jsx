// packages/blog-client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import PostList from './components/PostList';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import PostDetail from './components/PostDetail';
import ProfilePage from './components/ProfilePage';
import LandingPage from './components/LandingPage';

// ... other imports

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route path="/postList" element={<PostList />} />
            <Route path="/posts/:postId" element={<PostDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* ... other routes */}
           
          </Route>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
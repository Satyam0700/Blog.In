import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import IndexPage from './pages/IndexPage';
import { UserContextProvider } from './context/userContext';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import Edit from './pages/Edit';

function App() {
  return (
    <UserContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path={'/login'} element={<Login />} />
          <Route path={'/register'} element={<Register />} />
          <Route path={'/create'} element={<CreatePost />} />
          <Route path={'/post/:id'} element={<PostPage />} />
          <Route path={'/edit/:id'} element={<Edit />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;

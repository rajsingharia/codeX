import './App.css';
import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home'
import LoginRegister from './pages/auth/LoginRegister';
import { CodeEditor } from './pages/codeEditor/CodeEditor';
import { AuthContext } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoutes';
import { NotFound } from './pages/notFound/NotFound';
import PrivateHome from './pages/home/PrivateHome';
import { MyAccount } from './pages/myAccount/MyAccount';
import PublicHome from './pages/home/PublicHome';

function App() {

  const { loading } = useContext(AuthContext);

  return (
    <div className='app'>
      {
        loading ?
          <div>
            Loading...
          </div>
          :
          <>
            <Routes>
              {/* Protected Routes */}
              <Route path="/" element={<PrivateRoute />}>
                <Route path="/" element={<Home />}>
                  <Route path='/' element={<PublicHome />} />
                  <Route path="public" element={<PrivateHome />} />
                </Route>
                <Route path="my-account" element={<MyAccount />} />
                <Route path="code-editor/:codeEditorId" element={<CodeEditor isWatchMode={false} />} />
                <Route path="code-editor/share/:codeEditorId" element={<CodeEditor isWatchMode={true} />} />
              </Route>
              {/* Un protected Routes */}
              <Route path="/login-register/" element={<LoginRegister />} />
              {/* Default Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </>
      }
    </div >
  )
}

export default App

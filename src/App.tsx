import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import AuthPage from './pages/AuthPage';
import AppContextProvider from "./context/AppContext";
import Layout from "./layouts/layout";
import ProtectedRoute from "./layouts/ProtectedRoute";
import CreateFormPage from "./pages/CreateFormPage";
import FormPage from "./pages/FormPage";
import FormResponsesPage from "./pages/FormResponsesPage";
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function App() {

  return (
    <>
    <AppContextProvider>
      <Router>
          <Routes>
            <Route path="/" element={<Layout/>}>
              <Route path="/" element={<ProtectedRoute/>}>
                <Route index element={<CreateFormPage/>}/>
                <Route path="form-responses/:formId" element={<FormResponsesPage/>}/>
              </Route>
              <Route path="auth" element={<AuthPage/>}/>
              <Route path="form/:formId" element={<FormPage/>}/>
            </Route>
          </Routes>
        </Router>
    </AppContextProvider>
    </>
  );
}

export default App;

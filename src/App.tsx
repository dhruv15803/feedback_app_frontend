import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import AuthPage from './pages/AuthPage';
import AppContextProvider from "./context/AppContext";
import ProtectedRoute from "./layouts/ProtectedRoute";
import CreateFormPage from "./pages/CreateFormPage";
import FormPage from "./pages/FormPage";
import FormResponsesPage from "./pages/FormResponsesPage";
import MyFormsPage from "./pages/MyFormsPage";
import Layout from "./layouts/Layout";
import ThankYouPage from "./pages/ThankYouPage";
import LandingPage from "./pages/LandingPage";
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function App() {

  return (
    <>
    <AppContextProvider>
      <Router>
          <Routes>
            <Route path="/" element={<Layout/>}>
            <Route index element={<LandingPage/>}/>
              <Route path="/" element={<ProtectedRoute/>}>
                <Route path="/create" element={<CreateFormPage/>}/>
                <Route path="form-responses/:formId" element={<FormResponsesPage/>}/>
                <Route path="my-forms" element={<MyFormsPage/>}/>
              </Route>
              <Route path="auth" element={<AuthPage/>}/>
              <Route path="form/:formId" element={<FormPage/>}/>
              <Route path="/thank-you" element={<ThankYouPage/>}/>
            </Route>
          </Routes>
        </Router>
    </AppContextProvider>
    </>
  );
}

export default App;

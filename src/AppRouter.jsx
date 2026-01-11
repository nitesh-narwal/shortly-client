import { Route, Routes } from "react-router-dom";
import ShortenUrlPage from "./components/Dashboard/ShortenUrlPage";
import Navbar from "./components/NavBar";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import AboutPage from "./components/AboutPage";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import ErrorPage from "./components/ErrorPage";
import SettingsPage from "./components/SettingsPage";
import VerifyEmailPage from "./components/VerifyEmailPage";

const AppRouter = () => {
  return (
    // Your routing logic here
   <>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/about" element={<AboutPage />} />
          
          <Route path="/register" element={<PrivateRoute publicPage={true}><RegisterPage /></PrivateRoute>} />
          <Route path="/login" element={<PrivateRoute publicPage={true}><LoginPage /></PrivateRoute>} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          <Route path="/dashboard/*" element={<PrivateRoute publicPage={false}><DashboardLayout/></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute publicPage={false}><SettingsPage /></PrivateRoute>} />
          <Route path="/s/:url" element={<ShortenUrlPage />} />
          <Route path="*" element={<ErrorPage message="We cant seem to find the page you are looking for." />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      <Footer /> 
     </>
  );
}

export default AppRouter;

export const SubDomainRouter = () => {
  return (
    <Routes>
        <Route path="/:url" element={< ShortenUrlPage/>} />
    </Routes>
  );
}
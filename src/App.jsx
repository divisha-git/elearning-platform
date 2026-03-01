import "./App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import PaywallRoute from "./Components/Payments/PaywallRoute";

import Home from "./Components/Pages/Home";
import About1 from "./Components/Routes/About1";
import Courses1 from "./Components/Routes/Courses1";
import Team1 from "./Components/Routes/Team1";
import Testimonial1 from "./Components/Routes/Testimonial1";
import Contact1 from "./Components/Routes/Contact1";
import ErrorPage from "./Components/Pages/ErrorPage";
import AuthLanding from "./Components/Pages/AuthLanding";
import Sign from "./Components/Pages/Sign";
import SignUp from "./Components/Pages/Register";
import Javaprog from "./Components/Course/Javaprog";
import Dsa from "./Components/Course/Dsa";
import Mern from "./Components/Course/Mern";
import Fullstack from "./Components/Course/Fullstack";
import Programming from "./Components/Course/Programming";
import ShowBook from "./Components/Ebook/ShowBook";
import BotpressChatbot from "./Components/Ebook/BotpressChatbot";
import Reactjs from "./Components/Course/Reactjs";
import Express from "./Components/Course/Express";
import Nodejs from "./Components/Course/Nodejs";
import Mongodb from "./Components/Course/Mongodb";
import Mysql from "./Components/Course/Mysql";
import Javascript from "./Components/Course/Javascript";
import Html from "./Components/Course/Html";
import Css from "./Components/Course/Css";
import Advjava from "./Components/Course/Advjava";
import JavaQuiz from "./Components/Quiz/JavaQuiz";
import Test from "./Components/Pages/Test";
import FullstackQuiz from "./Components/Quiz/FullstackQuiz";
import JavascriptQuiz from "./Components/Quiz/JavascriptQuiz";
import ReactQuiz from "./Components/Quiz/ReactQuiz";
import Profile from "./Components/Pages/Profile";
import Feedback from "./Components/Pages/Feedback";
import InstructorDashboard from "./Components/Pages/InstructorDashboard";
import InstructorLogin from "./Components/Pages/InstructorLogin";
import Purchases from "./Components/Pages/Purchases";
import Classroom from "./Components/Live/Classroom";
import Projector from "./Components/Live/Projector";

function App() {
  // Helper to hide chatbot on specific routes
  const ChatbotWrapper = ({ children }) => {
    const location = useLocation();
    const { user } = useAuth();
    const path = location.pathname || "";
    const hideOnExact = [
      "/auth",
      "/signin",
      "/sign",
      "/register",
      "/instructor-login",
      "/purchases",
      "/contact",
      "/feedback",
      "/profile",
      "/instructor-dashboard",
    ];
    const isAssessment = path.startsWith("/test");
    const isCourses = path.startsWith("/courses") || path.startsWith("/cources");
    const hideChatbot = hideOnExact.includes(path) || isAssessment || isCourses;
    // If logged-in user is instructor, force them to the instructor dashboard only
    if (user?.role === 'instructor' && path !== '/instructor-dashboard') {
      return <Navigate to="/instructor-dashboard" replace />;
    }
    return (
      <>
        {children}
        {!hideChatbot && <BotpressChatbot />}
      </>
    );
  };
  return (
    <AuthProvider>
      <BrowserRouter>
        <ChatbotWrapper>
        <Routes>
          {/* Public Routes - Authentication Landing */}
          <Route path="/auth" element={<AuthLanding />} />
          <Route path="/instructor-login" element={<InstructorLogin />} />
          
          {/* Auth routes */}
          <Route path="/signin" element={<AuthLanding />} />
          <Route path="/sign" element={<AuthLanding />} />
          <Route path="/register" element={<SignUp />} />

          {/* Protected Routes - All main content requires authentication */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/about" element={
            <ProtectedRoute>
              <About1 />
            </ProtectedRoute>
          } />
          <Route path="/courses" element={
            <ProtectedRoute>
              <Courses1 />
            </ProtectedRoute>
          } />
          <Route path="/team" element={
            <ProtectedRoute>
              <Team1 />
            </ProtectedRoute>
          } />
          <Route path="/testimonial" element={
            <ProtectedRoute>
              <Testimonial1 />
            </ProtectedRoute>
          } />
          <Route path="/contact" element={
            <ProtectedRoute>
              <Contact1 />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Instructor-only route */}
          <Route path="/instructor-dashboard" element={
            <ProtectedRoute requireRole="instructor">
              <InstructorDashboard />
            </ProtectedRoute>
          } />

          {/* Live class routes */}
          <Route path="/live/classroom/:roomId" element={
            <ProtectedRoute requireRole="instructor">
              <Classroom />
            </ProtectedRoute>
          } />
          <Route path="/live/projector/:roomId" element={
            <ProtectedRoute>
              <Projector />
            </ProtectedRoute>
          } />

          {/* Protected Quiz Routes */}
          <Route path="/test" element={
            <ProtectedRoute>
              <Test />
            </ProtectedRoute>
          } />
          <Route path="/test/java" element={
            <ProtectedRoute>
              <JavaQuiz />
            </ProtectedRoute>
          } />
          <Route path="/test/fullstack" element={
            <ProtectedRoute>
              <FullstackQuiz />
            </ProtectedRoute>
          } />
          <Route path="/test/javascript" element={
            <ProtectedRoute>
              <JavascriptQuiz />
            </ProtectedRoute>
          } />
          <Route path="/test/react" element={
            <ProtectedRoute>
              <ReactQuiz />
            </ProtectedRoute>
          } />

          {/* Protected Course Routes */}
          <Route path="/courses/java" element={
            <ProtectedRoute>
              <PaywallRoute courseId="java" price={499} title="Java Programming">
                <Javaprog />
              </PaywallRoute>
            </ProtectedRoute>
          } />
          <Route path="/courses/dsa" element={
            <ProtectedRoute>
              <PaywallRoute courseId="dsa" price={499} title="DSA">
                <Dsa />
              </PaywallRoute>
            </ProtectedRoute>
          } />

          <Route path="/courses/mern" element={
            <ProtectedRoute>
              <PaywallRoute courseId="mern" price={799} title="MERN">
                <Mern />
              </PaywallRoute>
            </ProtectedRoute>
          } />
          <Route path="/courses/mern/nodejs" element={
            <ProtectedRoute>
              <PaywallRoute courseId="mern-nodejs" price={299} title="Node.js">
                <Nodejs />
              </PaywallRoute>
            </ProtectedRoute>
          } />
          <Route path="/courses/mern/express" element={
            <ProtectedRoute>
              <PaywallRoute courseId="mern-express" price={299} title="Express.js">
                <Express />
              </PaywallRoute>
            </ProtectedRoute>
          } />
          <Route path="/courses/mern/react" element={
            <ProtectedRoute>
              <PaywallRoute courseId="mern-react" price={299} title="React.js">
                <Reactjs />
              </PaywallRoute>
            </ProtectedRoute>
          } />
          <Route path="/courses/mern/mongodb" element={
            <ProtectedRoute>
              <PaywallRoute courseId="mern-mongodb" price={299} title="MongoDB">
                <Mongodb />
              </PaywallRoute>
            </ProtectedRoute>
          } />

          <Route path="/courses/fullstack" element={
            <ProtectedRoute>
              <PaywallRoute courseId="fullstack" price={899} title="Fullstack">
                <Fullstack />
              </PaywallRoute>
            </ProtectedRoute>
          } />
          <Route path="/courses/fullstack/sql" element={
            <ProtectedRoute>
              <PaywallRoute courseId="fullstack-sql" price={299} title="MySQL">
                <Mysql />
              </PaywallRoute>
            </ProtectedRoute>
          } />
          <Route path="/courses/fullstack/nodejs" element={
            <ProtectedRoute>
              <PaywallRoute courseId="fullstack-nodejs" price={299} title="Node.js">
                <Nodejs />
              </PaywallRoute>
            </ProtectedRoute>
          } />
          <Route path="/courses/fullstack/express" element={
            <ProtectedRoute>
              <PaywallRoute courseId="fullstack-express" price={299} title="Express.js">
                <Express />
              </PaywallRoute>
            </ProtectedRoute>
          } />
          <Route path="/courses/fullstack/react" element={
            <ProtectedRoute>
              <PaywallRoute courseId="fullstack-react" price={299} title="React.js">
                <Reactjs />
              </PaywallRoute>
            </ProtectedRoute>
          } />
          <Route path="/courses/fullstack/mongodb" element={
            <ProtectedRoute>
              <PaywallRoute courseId="fullstack-mongodb" price={299} title="MongoDB">
                <Mongodb />
              </PaywallRoute>
            </ProtectedRoute>
          } />
          <Route path="/courses/fullstack/javascript" element={
            <ProtectedRoute>
              <PaywallRoute courseId="fullstack-javascript" price={299} title="JavaScript">
                <Javascript />
              </PaywallRoute>
            </ProtectedRoute>
          } />
          <Route path="/courses/fullstack/html" element={
            <ProtectedRoute>
              <PaywallRoute courseId="fullstack-html" price={199} title="HTML">
                <Html />
              </PaywallRoute>
            </ProtectedRoute>
          } />
          <Route path="/courses/fullstack/css" element={
            <ProtectedRoute>
              <PaywallRoute courseId="fullstack-css" price={199} title="CSS">
                <Css />
              </PaywallRoute>
            </ProtectedRoute>
          } />

          <Route path="/cources/programming" element={
            <ProtectedRoute>
              <PaywallRoute courseId="programming" price={399} title="Programming">
                <Programming />
              </PaywallRoute>
            </ProtectedRoute>
          } />
          <Route path="/cources/programming/java" element={
            <ProtectedRoute>
              <PaywallRoute courseId="programming-java" price={499} title="Java Programming">
                <Javaprog />
              </PaywallRoute>
            </ProtectedRoute>
          } />
          <Route path="/cources/programming/advJava" element={
            <ProtectedRoute>
              <PaywallRoute courseId="programming-advjava" price={599} title="Advanced Java">
                <Advjava />
              </PaywallRoute>
            </ProtectedRoute>
          } />
          <Route path="/cources/programming/javascript" element={
            <ProtectedRoute>
              <PaywallRoute courseId="programming-javascript" price={499} title="JavaScript">
                <Javascript />
              </PaywallRoute>
            </ProtectedRoute>
          } />

          {/* Protected Library and Feedback Routes */}
          <Route path="/library" element={
            <ProtectedRoute>
              <ShowBook />
            </ProtectedRoute>
          } />
          <Route path="/feedback" element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          } />

          {/* Purchases */}
          <Route path="/purchases" element={
            <ProtectedRoute>
              <Purchases />
            </ProtectedRoute>
          } />

          {/* Error Page */}
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        </ChatbotWrapper>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

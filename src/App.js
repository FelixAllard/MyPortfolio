import React, { useState, useEffect } from "react";
import Preloader from "../src/components/Pre";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Footer from "./components/Footer";
import Resume from "./components/Resume/ResumeNew";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import "./style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Blog from "./components/Blog/Blog";
import './Languages/i18n';
import i18n from 'i18next';
import {I18nextProvider} from "react-i18next";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import BlogAdmin from "./components/Blog/BlogAdmin";
import AddProject from "./components/Projects/AddProject";
import UpdateProject from "./components/Projects/UpdateProject";
import ContactMeAdmin from "./components/ContactMe/ContactMeAdmin";  // Import i18n to check its state

function App() {
  const [load, updateLoad] = useState(true);
  const [isReady, setIsReady] = useState(false);  // Track if i18next is ready

  useEffect(() => {
    const checkI18nInitialization = () => {
      if (i18n.isInitialized) {
        setIsReady(true);  // i18next initialized
      } else {
        i18n.on('initialized', () => setIsReady(true));  // Wait for i18next to initialize
      }
    };

    checkI18nInitialization();

    const timer = setTimeout(() => {
      updateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <div>Loading...</div>; // Wait until i18next is initialized
  }

  return (
      <I18nextProvider i18n={i18n}>
        <Router>
          <Preloader load={load} />
          <div className="App d-flex flex-column min-vh-100" id={load ? "no-scroll" : "scroll"}>
            <Navbar />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project" element={<Projects />} />
              <Route path="/about" element={<About />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/admin/blog" element={<BlogAdmin/>}/>
              <Route path="*" element={<Navigate to="/"/>} />
              <Route path="/login" element={<Login/>}/>
              <Route path="/register" element={<Register />} />
              <Route path="/project/create" element={<AddProject/>}/>
              <Route path="/project/update/:id" element={<UpdateProject />} />
              <Route path="/admin/dashboard" element={<ContactMeAdmin/>}/>

            </Routes>
            {/*<Footer />*/}
          </div>
          </Router>
      </I18nextProvider>
  );
}

export default App;

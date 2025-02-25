import React, { useState } from "react";
import { useTranslation } from "react-i18next";  // Import i18n hook
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import logo from "../Assets/logo2.png";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { CgGitFork } from "react-icons/cg";
import { ImBlog, ImUser } from "react-icons/im";
import {
  AiFillStar,
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineUser,
  AiOutlineLogout

} from "react-icons/ai";
import { CgFileDocument } from "react-icons/cg";
import LanguageToggle from "../Languages/LanguageToggle";
import { isLoggedIn, logout } from "../AxiosInstance";

function NavBar() {
  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);
  const { t } = useTranslation("navbar"); // Use translation hook

  function scrollHandler() {
    if (window.scrollY >= 20) {
      updateNavbar(true);
    } else {
      updateNavbar(false);
    }
  }

  window.addEventListener("scroll", scrollHandler);

  function handleLogout() {
    logout();
    window.location.reload();
  }

  return (
      <Navbar expanded={expand} fixed="top" expand="md" className={navColour ? "sticky" : "navbar"}>
        <Container>
          <Navbar.Brand href="/" className="d-flex">
            <img src={logo} className="img-fluid logo" alt="brand" />
          </Navbar.Brand>
          <Navbar.Toggle
              aria-controls="responsive-navbar-nav"
              onClick={() => {
                updateExpanded(expand ? false : "expanded");
              }}
          >
            <span></span>
            <span></span>
            <span></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav.Item>
              <LanguageToggle />
            </Nav.Item>

            <Nav className="ms-auto" defaultActiveKey="#home">
              <Nav.Item>
                <Nav.Link as={Link} to="/" onClick={() => updateExpanded(false)}>
                  <AiOutlineHome style={{ marginBottom: "2px" }} /> {t('home')}
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link as={Link} to="/about" onClick={() => updateExpanded(false)}>
                  <AiOutlineUser style={{ marginBottom: "2px" }} /> {t('about')}
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link as={Link} to="/project" onClick={() => updateExpanded(false)}>
                  <AiOutlineFundProjectionScreen style={{ marginBottom: "2px" }} /> {t('projects')}
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link as={Link} to="/resume" onClick={() => updateExpanded(false)}>
                  <CgFileDocument style={{ marginBottom: "2px" }} /> {t('resume')}
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link as={Link} to="/blog" onClick={() => updateExpanded(false)}>
                  <ImBlog style={{ marginBottom: "2px" }} /> {t('blog')}
                </Nav.Link>
              </Nav.Item>

              {/* Corrected logic for displaying the login/logout button */}
              {isLoggedIn() ?
              (
                  <Nav.Item>
                    <Nav.Link onClick={handleLogout}>
                      <AiOutlineLogout style={{ marginBottom: "2px" }} /> {t('loggedin')}
                    </Nav.Link>
                  </Nav.Item>

              ) : (
                  <Nav.Item>
                    <Nav.Link as={Link} to="/login" onClick={() => updateExpanded(false)}>
                      <ImUser style={{ marginBottom: "2px" }} /> {t('login')}
                    </Nav.Link>
                  </Nav.Item>
              )}
              {isLoggedIn() &&
                  (
                      <Nav.Link as={Link} to="/admin/dashboard" onClick={() => updateExpanded(false)}>
                        <AiOutlineHome style={{ marginBottom: "2px" }} /> Admin Dashboard
                      </Nav.Link>
                  )
              }

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}

export default NavBar;

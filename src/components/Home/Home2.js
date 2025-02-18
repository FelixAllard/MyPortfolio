import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.svg";
import Tilt from "react-parallax-tilt";
import { AiFillGithub, AiOutlineTwitter, AiFillInstagram } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { useTranslation } from "react-i18next";
function Home2() {
  const { t } = useTranslation("home2");

  return (
      <Container fluid className="home-about-section" id="about">
        <Container>
          <Row>
            <Col md={8} className="home-about-description">
              <h1 style={{ fontSize: "2.6em" }}>
                {t(`intro_title`)}
              </h1>
              <p className="home-about-body">
                {t("intro_text")}
                <br />
                <br />{t("skills")}
                <i>
                  <b className="purple"> {t("languages")} </b>
                </i>
                <br />
                <br />
                {t("interests")} &nbsp;
                <i>
                  <b className="purple">{t("games")}</b> {t("web_dev")}
                </i>
                <br />
                <br />
                {t("passion")}
                <b className="purple"> Node.js</b> {t("tech_stack")}
                &nbsp; <i>
                <b className="purple">{t("frameworks")}</b>
              </i>
              </p>
            </Col>
            <Col md={4} className="myAvtar">
              <Tilt>
                <img src={myImg} className="img-fluid" alt="avatar" />
              </Tilt>
            </Col>
          </Row>
          <Row>
            <Col md={12} className="home-about-social">
              <h1>{t("find_me")}</h1>
              <p>
                {t("connect")}
              </p>
              <ul className="home-about-social-links">
                <li className="social-icons">
                  <a href="https://github.com/soumyajit4419" target="_blank" rel="noreferrer" className="icon-colour  home-social-icons">
                    <AiFillGithub />
                  </a>
                </li>
                <li className="social-icons">
                  <a href="https://twitter.com/Soumyajit4419" target="_blank" rel="noreferrer" className="icon-colour  home-social-icons">
                    <AiOutlineTwitter />
                  </a>
                </li>
                <li className="social-icons">
                  <a href="https://www.linkedin.com/in/soumyajit4419/" target="_blank" rel="noreferrer" className="icon-colour  home-social-icons">
                    <FaLinkedinIn />
                  </a>
                </li>
                <li className="social-icons">
                  <a href="https://www.instagram.com/soumyajit4419" target="_blank" rel="noreferrer" className="icon-colour home-social-icons">
                    <AiFillInstagram />
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </Container>
  );
}

export default Home2;

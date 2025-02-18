import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import homeLogo from "../../Assets/home-main.svg";
import Particle from "../Particle";
import Home2 from "./Home2";
import Type from "./Type";
import Tilt from "react-parallax-tilt";
import myImg from "../../Assets/avatar.svg";
import { AiFillGithub, AiFillInstagram, AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation("home");

  return (
      <section>
        <Container fluid className="home-section" id="home">
          <Particle />
          <Container className="home-content">
            <Row>
              <Col md={7} className="home-header">
                <h1 style={{ paddingBottom: 15 }} className="heading">
                  {t('greeting')}{" "}
                  <span className="wave" role="img" aria-labelledby="wave">
                  {t('wave')}
                </span>
                </h1>

                <h1 className="heading-name">
                  {t('name')}
                  <strong className="main-name">{t('fullName')}</strong>
                </h1>

                <div style={{ padding: 50, textAlign: "left" }}>
                  <Type />
                </div>
              </Col>

              <Col md={5} style={{ paddingBottom: 20 }}>
                <img
                    src={homeLogo}
                    alt="home pic"
                    className="img-fluid"
                    style={{ maxHeight: "450px" }}
                />
              </Col>
            </Row>
          </Container>
        </Container>
        <Home2 />
      </section>
  );
}

export default Home;

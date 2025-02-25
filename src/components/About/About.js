import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import Github from "./Github";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import MyPerson from "./MyPerson.png";
import Toolstack from "./Toolstack";
import { useTranslation } from "react-i18next";
import {isLoggedIn} from "../../AxiosInstance";
import AddSkill from "./AddSkill";


function About() {
  const { t } = useTranslation("about");

  return (
      <Container fluid className="about-section">
        <Particle />
        <Container>
          <Row style={{ justifyContent: "center", padding: "10px" }}>
            <Col
                md={7}
                style={{
                  justifyContent: "center",
                  paddingTop: "30px",
                  paddingBottom: "50px",
                }}
            >
              <h1 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
                {t("knowWho")} <strong className="purple">{t("iAm")}</strong>
              </h1>
              <Aboutcard />
            </Col>
            <Col
                md={5}
                style={{ paddingTop: "120px", paddingBottom: "50px" }}
                className="about-img"
            >
              <img src={MyPerson} alt="about" className="img-fluid" />
            </Col>
          </Row>

        {isLoggedIn() && <AddSkill />}


            <h1 className="project-heading">
            {t("professionalSkillset")} <strong className="purple">{t("skillset")}</strong>
          </h1>

          <Techstack />

          <h1 className="project-heading">
            <strong className="purple">{t("tools")}</strong> {t("iUse")}
          </h1>
          <Toolstack />

          <Github />
        </Container>
      </Container>
  );
}

export default About;

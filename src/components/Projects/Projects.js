import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import {isLoggedIn, makeRequest} from "../../AxiosInstance";
import { useTranslation } from "react-i18next";
import {Link} from "react-router-dom";
import {AiOutlinePlus} from "react-icons/ai";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

function Projects() {
  const { t, i18n } = useTranslation("project");
  const isFrench = i18n.language === "fr";
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await makeRequest("GET", "/Projects");
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
      <Container fluid className="project-section">
        <Particle />


        <Container fluid>
          <h1 className="project-heading">
            {t("heading")}
          </h1>
          <p style={{ color: "white" }}>
            {t("subheading")}
          </p>
          <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
            {projects.map((project) => (
                <Col md={4} className="project-card" key={project.id}>
                  <ProjectCard
                      id={project.id}
                      imgPath={project.imageLink}
                      isBlog={false}
                      title={isFrench ? project.nameFr : project.nameEn}
                      description={isFrench ? project.descriptionFr : project.descriptionEn}
                      ghLink={project.githubLink}
                  />
                </Col>
            ))}
            {isLoggedIn()&&(
                <Col md={4} className="project-card">
                  <Button as={Link} to="/project/create" variant="primary">
                    <AiOutlinePlus style={{marginBottom: "2px"}}/> Add Project
                  </Button>

                </Col>
            )}

          </Row>
        </Container>
      </Container>
  );
}

export default Projects;

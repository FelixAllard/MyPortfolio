import React, {useEffect, useState} from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import leaf from "../../Assets/Projects/leaf.png";
import emotion from "../../Assets/Projects/emotion.png";
import editor from "../../Assets/Projects/codeEditor.png";
import chatify from "../../Assets/Projects/chatify.png";
import suicide from "../../Assets/Projects/suicide.png";
import bitsOfCode from "../../Assets/Projects/blog.png";
import {makeRequest} from "../../AxiosInstance";
import {useTranslation} from "react-i18next";


function Projects() {
  const { i18n } = useTranslation();

  // Check if the current language is French
  const isFrench = i18n.language === 'fr';
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await makeRequest('GET', '/Projects');
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>

            {projects.map((project) => (
                <Col md={4} className="project-card">
                  <ProjectCard
                      imgPath={project.imageLink}
                      isBlog={false}
                      title={isFrench? project.nameFr: project.nameEn}
                      description={isFrench? project.descriptionFr : project.descriptionEn }
                      ghLink={project.githubLink}
                  />

                </Col>
                ))}
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;

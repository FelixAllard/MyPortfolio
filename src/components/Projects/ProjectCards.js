import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";
import {isLoggedIn, makeRequest} from "../../AxiosInstance";

function ProjectCards(props) {
    const handleUpdate = () => {
        // Placeholder for update logic
        alert(`Update project: ${props.title}`);
    };

    const handleDelete = async (projectId) => {
        try {
            const response = await makeRequest('DELETE', `/Projects/${projectId}`);

            if (response && response.status === 200) {
                console.log('Project deleted successfully:', response.data);
                // Optionally, remove the project from the UI or refresh the list
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to delete project:', error.response ? error.response.data : error.message);
        }
    };


    return (
        <Card className="project-card-view">
            <Card.Img variant="top" src={props.imgPath} alt="card-img" />
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <Card.Text style={{ textAlign: "justify" }}>
                    {props.description}
                </Card.Text>
                <Button variant="primary" href={props.ghLink} target="_blank">
                    <BsGithub /> &nbsp;
                    {props.isBlog ? "Blog" : "GitHub"}
                </Button>

                {/* If the component contains Demo link and if it's not a Blog then, it will render the below component */}
                {!props.isBlog && props.demoLink && (
                    <Button
                        variant="primary"
                        href={props.demoLink}
                        target="_blank"
                        style={{ marginLeft: "10px" }}
                    >
                        <CgWebsite /> &nbsp; {"Demo"}
                    </Button>
                )}

                {/* Render Update and Delete buttons if the user is logged in */}
                {isLoggedIn() && (
                    <div style={{ marginTop: "10px" }}>
                        <Button variant="warning" onClick={handleUpdate} style={{ marginRight: "10px" }}>
                            Update
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(props.id)}>
                            Delete
                        </Button>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}

export default ProjectCards;

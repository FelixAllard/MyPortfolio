import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";
import { isLoggedIn, makeRequest } from "../../AxiosInstance";
import { useNavigate } from "react-router-dom";

function ProjectCards(props) {
    const navigate = useNavigate();

    // Navigate to the update page with the project ID
    const handleUpdate = () => {
        navigate(`/project/update/${props.id}`, { state: { project: props } });
    };

    const handleDelete = async (projectId) => {
        try {
            const response = await makeRequest('DELETE', `/Projects/${projectId}`);
            window.location.reload();
            if (response && response.status === 200) {

                console.log('Project deleted successfully:', response.data);

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

import React, { useState } from "react";
import { Button, Form, Card, Container, Row, Col } from "react-bootstrap";
import { makeRequest } from "../../AxiosInstance";

function AddSkillForm() {
    const [name, setName] = useState("");
    const [iconName, setIconName] = useState("");
    const [tool, setTool] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const skillData = { name, icon_name: iconName, tool };

        try {
            const response = await makeRequest("POST", "/Skill", skillData);
            setSuccessMessage("Skill added successfully!");
            setErrorMessage("");
            setName("");
            setIconName("");
            setTool(false);
            window.location.reload();
        } catch (error) {
            setErrorMessage("Failed to add skill. Please try again.");
            setSuccessMessage("");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center my-5">
            <Card className="p-4 shadow rounded-4 bg-dark" style={{ width: "100%", maxWidth: "500px" }}>
                <h3 className="text-center mb-4">Add New Skill</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formSkillName" className="mb-3">
                        <Form.Label>Skill Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter skill name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formSkillIconName" className="mb-3">
                        <Form.Label>Icon Path Data</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter icon path data"
                            value={iconName}
                            onChange={(e) => setIconName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formSkillTool" className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Is this a tool?"
                            checked={tool}
                            onChange={() => setTool(!tool)}
                        />
                    </Form.Group>

                    {iconName && (
                        <div className="text-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                <path fill="rgba(255, 255, 255, 0)" d="M6,42V6h36v36H6z"></path>
                                <path fill="#000000" d={iconName}></path>
                            </svg>
                        </div>
                    )}

                    {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                    {successMessage && <p className="text-success text-center">{successMessage}</p>}

                    <Button variant="primary" type="submit" className="w-100 rounded-3">
                        Add Skill
                    </Button>
                </Form>
            </Card>
        </Container>
    );
}

export default AddSkillForm;

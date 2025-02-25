import React, { useEffect, useState } from "react";
import { Col, Row, Modal, Form, Container, Button } from "react-bootstrap";
import { isLoggedIn, makeRequest } from "../../AxiosInstance";
import AddSkill from "./AddSkill";

function Techstack() {
    const [skills, setSkills] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [name, setName] = useState("");
    const [iconName, setIconName] = useState("");
    const [tool, setTool] = useState(false);

    const handleDelete = async (skillId) => {
        try {
            const response = await makeRequest('DELETE', `/Skill/${skillId}`);
            if (response && response.status === 200) {
                setSkills(skills.filter(skill => skill.id !== skillId));
            }
        } catch (error) {
            console.error('Failed to delete skill:', error.response ? error.response.data : error.message);
        }
    };

    const handleModify = (skill) => {
        setSelectedSkill(skill);
        setName(skill.name);
        setIconName(skill.icon_name);
        setTool(skill.tool);
        setShowModal(true);
    };

    const handleSaveChanges = async () => {
        try {
            const updatedSkill = { name, icon_name: iconName, tool };
            const response = await makeRequest('PUT', `/Skill/${selectedSkill.id}`, updatedSkill);
            window.location.reload();
            if (response && response.status === 200) {
                setSkills(skills.map(skill => skill.id === selectedSkill.id ? { ...skill, ...updatedSkill } : skill));
                setShowModal(false);
            }
        } catch (error) {
            console.error('Failed to update skill:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const data = await makeRequest("GET", "/Skill/false");
                setSkills(data);
            } catch (error) {
                console.error("Failed to fetch Skills:", error);
            }
        };
        fetchSkills();
    }, []);

    return (
        <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
            {skills.map((skill) => (
                <Col xs={4} md={2} className="tech-icons" key={skill.id}>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                        <path fill="rgba(255, 255, 255, 0)" d="M6,42V6h36v36H6z"></path>
                        <path fill="#ffffff" d={skill.icon_name}></path>
                    </svg>
                    {isLoggedIn() && (
                        <div style={{ marginTop: "10px" }}>
                            <Button variant="warning" onClick={() => handleModify(skill)}>Modify</Button>
                            <Button variant="danger" onClick={() => handleDelete(skill.id)}>Delete</Button>
                        </div>
                    )}
                </Col>
            ))}


            {/* Modal for modifying skills */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Modify Skill</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Skill Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter skill name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Icon Path Data</Form.Label>
                            <Form.Control
                                type="text"
                                value={iconName}
                                onChange={(e) => setIconName(e.target.value)}
                                placeholder="Enter icon path data"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Is this a tool?"
                                checked={tool}
                                onChange={() => setTool(!tool)}
                            />
                        </Form.Group>
                        {iconName && (
                            <div className="text-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 48 48">
                                    <path fill="#ffffff" d="M6,42V6h36v36H6z"></path>
                                    <path fill="#000001" d={iconName}></path>
                                </svg>
                            </div>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </Row>
    );
}

export default Techstack;

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import { makeRequest } from "../../AxiosInstance";
import { useTranslation } from "react-i18next";
import { isLoggedIn } from "../../AxiosInstance";
import Particle from "../Particle";

function Blog() {
    const { t } = useTranslation("blog");

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null); // New state for selected status

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await makeRequest('GET', '/Comment/0');
                setComments(data);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        };

        fetchComments();
    }, []);

    const handleAddComment = async () => {
        if (!newComment.trim() || !username.trim() || username.length > 20) return;

        setLoading(true);

        try {
            const newCommentData = {
                User: username.trim(),
                Comment: newComment.trim(),
            };

            const response = await makeRequest('POST', '/Comment', newCommentData);

            if (response) {
                // Append " - Sent for approval" to the username
                const modifiedComment = { ...response, userName: `${response.userName} - Sent for approval` };
                setComments([modifiedComment, ...comments]);
                setNewComment('');
                setUsername('');
            }
            console.log(response.data);
        } catch (error) {
            console.error('Failed to add comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 0:
                return "bg-success text-dark"; // light green background with dark text
            case 1:
                return "bg-warning text-dark"; // light orange background with dark text
            case 2:
                return "bg-danger text-light"; // light red background with white text
            case 3:
                return "bg-secondary text-dark"; // light gray background with dark text
            default:
                return "";
        }
    };

    const handleStatusChange = async (commentId, newStatus) => {
        try {
            // Update the status of the comment in the backend
            const response = await makeRequest('PUT', `/status/${commentId}`, newStatus );

            // Update the comment's status locally in the state
            if (response) {
                const updatedComments = comments.map((comment) =>
                    comment.id === commentId ? { ...comment, status: newStatus } : comment
                );
                setComments(updatedComments);
            }
        } catch (error) {
            console.error('Failed to change comment status:', error);
        }
    };

    const filteredComments = selectedStatus === null
        ? comments
        : comments.filter((comment) => comment.status === selectedStatus);

    return (
        <Container fluid className="comment-section">
            <Particle/>
            <Container>
                <br />
                <h1 className="project-heading">{t("title")}</h1>

                {isLoggedIn() && (
                    <div className="status-filter">
                        <Dropdown>
                            <Dropdown.Toggle variant="info" id="status-dropdown">
                                {t("filterByStatus")}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setSelectedStatus(null)}>
                                    {t("allStatus")}
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => setSelectedStatus(0)}>
                                    {t("approved")}
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => setSelectedStatus(1)}>
                                    {t("unapproved")}
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => setSelectedStatus(2)}>
                                    {t("rejected")}
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => setSelectedStatus(3)}>
                                    {t("deleted")}
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                )}

                {filteredComments.length === 0 ? (
                    <div className="no-comments-placeholder">
                        <h4>{t("noComments")}</h4>
                        <p>{t("beFirst")}</p>
                    </div>
                ) : (
                    <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
                        {filteredComments.map((comment) => (
                            <Col
                                md={4}
                                className="project-card"
                                key={comment.id}
                            >
                                <div className={`card shadow-sm ${isLoggedIn() ? getStatusColor(comment.status) : ''}`}>
                                    <div className="card-header">
                                        {t("commentBy")}: {comment.userName}
                                        {isLoggedIn() && (
                                            <Dropdown className="status-dropdown">
                                                <Dropdown.Toggle variant="success" id="status-dropdown">
                                                    {t("status")}: {comment.status === 0 ? t("approved") : comment.status === 1 ? t("unapproved") : comment.status === 2 ? t("rejected") : t("deleted")}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handleStatusChange(comment.id, 0)}>{t("approved")}</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleStatusChange(comment.id, 1)}>{t("unapproved")}</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleStatusChange(comment.id, 2)}>{t("rejected")}</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleStatusChange(comment.id, 3)}>{t("deleted")}</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        )}
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">{comment.text}</p>
                                        {isLoggedIn() && (
                                            <p className="card-text">
                                                <small className="text-muted">
                                                    {t("postedOn")}: {new Date(comment.date).toLocaleString()}
                                                </small>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}

                {!isLoggedIn() && (
                    <div className="add-comment-section mt-4">
                        <h4>{t("addComment")}</h4>
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder={t("usernamePlaceholder")}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            maxLength={20}
                        />
                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder={t("placeholder")}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        ></textarea>
                        <button
                            className="btn btn-primary mt-3"
                            onClick={handleAddComment}
                            disabled={!newComment.trim() || !username.trim() || username.length > 20 || loading}
                        >
                            {loading ? t("posting") : t("postButton")}
                        </button>
                    </div>
                )}
            </Container>
        </Container>
    );
}

export default Blog;

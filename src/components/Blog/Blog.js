import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { makeRequest } from "../../AxiosInstance"; // Custom axios instance
import { useTranslation } from "react-i18next";
import { isLoggedIn } from "../../AxiosInstance";

function Blog() {
    const { t } = useTranslation();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

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

    const handleAddComment = async (commentText) => {
        if (!commentText.trim()) return; // Prevent submission if empty

        setLoading(true);

        try {
            const newCommentData = { text: commentText };

            // API call to POST the new comment
            const response = await makeRequest('POST', '/Comment', newCommentData);

            if (response) {
                // On success, add the new comment
                setComments([response, ...comments]);
                setNewComment('');
            }
        } catch (error) {
            console.error('Failed to add comment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="comment-section bg-dark text-white py-5">
            <Container>
                <h1 className="text-center mb-4">{t("title")}</h1>

                {/* Placeholder when there are no comments */}
                {comments.length === 0 ? (
                    <div className="text-center p-4 bg-secondary rounded">
                        <h4>{t("noComments")}</h4>
                        <p>{t("beFirst")}</p>
                    </div>
                ) : (
                    <Row className="justify-content-center">
                        {comments.map((comment) => (
                            <Col md={6} lg={4} key={comment.id} className="mb-4">
                                <Card className="bg-secondary text-white shadow-lg">
                                    <Card.Header className="fw-bold">
                                        {t("commentBy")}: {comment.userName}
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Title>{t("commentOnPost", { postId: comment.postId })}</Card.Title>
                                        <Card.Text>{comment.text}</Card.Text>
                                        <Card.Footer className="text-muted small">
                                            {t("postedOn")}: {new Date(comment.date).toLocaleString()}
                                        </Card.Footer>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

                {isLoggedIn() && (
                    <div className="add-comment-section mt-5">
                        <h4>{t("addComment")}</h4>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            className="bg-dark text-white border-secondary mb-3"
                            placeholder={t("placeholder")}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button
                            variant="primary"
                            onClick={() => handleAddComment(newComment)}
                            disabled={!newComment.trim() || loading}
                        >
                            {loading ? t("posting") : t("postButton")}
                        </Button>
                    </div>
                )}
            </Container>
        </Container>
    );
}

export default Blog;

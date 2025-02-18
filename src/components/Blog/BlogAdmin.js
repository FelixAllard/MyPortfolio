import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { makeRequest } from "../../AxiosInstance"; // Assumes this is a custom axios instance
import { useTranslation } from "react-i18next";
import { isLoggedIn } from "../../AxiosInstance";

function BlogAdmin() {
    const { i18n } = useTranslation();

    // Check if the current language is French
    const isFrench = i18n.language === 'fr';
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await makeRequest('GET', '/Comment/og/0');
                setComments(data);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        };

        fetchComments();
    }, []);

    const handleAddComment = async (commentId) => {
        setLoading(true); // Show loading state while the comment is being posted

        try {
            const updatedCommentData = {
            };

            // API call to PUT the comment with the specified ID
            const response = await makeRequest('PUT', `/Comment/add/${commentId}`, updatedCommentData);

            if (response) {
                // On success, update the state and remove the added comment
                setComments(prevComments =>
                    prevComments.filter(comment => comment.id !== commentId)
                );
                setNewComment(''); // Clear the textarea
            }
        } catch (error) {
            console.error('Failed to add comment:', error);
        } finally {
            setLoading(false); // Hide loading state after the request completes
        }
    };

    const handleDelComment = async (commentId) => {
        setLoading(true); // Show loading state while the comment is being posted

        try {
            const updatedCommentData = {
            };

            // API call to PUT the comment with the specified ID
            const response = await makeRequest('PUT', `/Comment/delete/${commentId}`, updatedCommentData);

            if (response) {
                // On success, remove the deleted comment from the state
                setComments(prevComments =>
                    prevComments.filter(comment => comment.id !== commentId)
                );
            }
        } catch (error) {
            console.error('Failed to delete comment:', error);
        } finally {
            setLoading(false); // Hide loading state after the request completes
        }
    };

    return (
        <Container fluid className="comment-section">
            <Container>
                <br />
                <br />
                <br />
                <h1 className="project-heading">Comments</h1>

                {/* Placeholder box when there are no comments */}
                {comments.length === 0 ? (
                    <div className="no-comments-placeholder">
                        <h4>No comments yet!</h4>
                        <p>Be the first to share your thoughts.</p>
                    </div>
                ) : (
                    <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
                        {comments.map((comment) => (
                            <Col md={4} className="project-card" key={comment.id}>
                                <div className="card shadow-sm">
                                    <div className="card-header">
                                        Comment by: {comment.userName}
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title">Comment on Post {comment.postId}</h5>
                                        <p className="card-text">
                                            <small className="text-muted">
                                                Posted on: {new Date(comment.date).toLocaleString()}
                                            </small>
                                        </p>
                                        <button
                                            className="btn btn-primary mt-3"
                                            onClick={() => handleAddComment(comment.id)}
                                        >
                                            {loading ? 'Posting...' : 'Add Comment'}
                                        </button>
                                        <button
                                            className="btn btn-danger mt-3"
                                            onClick={() => handleDelComment(comment.id)}
                                        >
                                            {loading ? 'Deleting...' : 'Del Comment'}
                                        </button>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}

            </Container>
        </Container>
    );
}

export default BlogAdmin;

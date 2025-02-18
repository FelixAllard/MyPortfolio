import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { makeRequest } from "../../AxiosInstance"; // Assumes this is a custom axios instance
import { useTranslation } from "react-i18next";
import { isLoggedIn } from "../../AxiosInstance";

function Blog() {
    const { i18n } = useTranslation();

    // Check if the current language is French
    const isFrench = i18n.language === 'fr';
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
        if (!commentText.trim()) return; // Prevent submission if the comment is empty

        setLoading(true); // Show loading state while the comment is being posted

        try {
            const newCommentData = {
                text: commentText, // Only the text field needs to be filled
            };

            // API call to POST the new comment
            const response = await makeRequest('POST', '/Comment', commentText);

            if (response) {
                // On success, add the new comment to the state
                setComments([response, ...comments]);
                setNewComment(''); // Clear the textarea
            }
        } catch (error) {
            console.error('Failed to add comment:', error);
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
                                        <p className="card-text">{comment.text}</p>
                                        <p className="card-text">
                                            <small className="text-muted">
                                                Posted on: {new Date(comment.date).toLocaleString()}
                                            </small>
                                        </p>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}
                {isLoggedIn() && (
                    <div className="add-comment-section mt-4">
                        <h4>Add a Comment</h4>
                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Share your thoughts here..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        ></textarea>
                        <button
                            className="btn btn-primary mt-3"
                            onClick={() => handleAddComment(newComment)}
                            disabled={!newComment.trim() || loading}
                        >
                            {loading ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                )}
            </Container>
        </Container>
    );
}

export default Blog;

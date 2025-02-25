import { useState, useEffect } from "react";
import { makeRequest } from "../../AxiosInstance"; // Ensure the correct path
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProject = () => {
    const { id } = useParams(); // Get project ID from route
    const navigate = useNavigate();

    const [project, setProject] = useState({
        nameEn: "",
        nameFr: "",
        descriptionEn: "",
        descriptionFr: "",
        imageLink: "",
        githubLink: "",
    });

    // Fetch the project data on component mount
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await makeRequest("GET", `/Projects/${id}`);
                console.log("Full Response:", response); // Log the entire response object

                // Check if response is an object and not undefined
                if (response) {
                    setProject(response); // Populate form with existing data directly from response
                } else {
                    alert("Project data is not available.");
                }
            } catch (error) {
                console.error("Error fetching project:", error);
                alert("Error fetching project: " + (error.response?.data || error.message));
            }
        };

        fetchProject();
    }, [id]);




    // Handle form input changes
    const handleChange = (e) => {
        setProject({ ...project, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await makeRequest("PUT", `/Projects/${id}`, project);
            navigate("/project");
        } catch (error) {
            alert("Error updating project: " + (error.response?.data || error.message));
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: "500px" }}>
                <h3 className="text-center mb-4">Update Project</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="nameEn"
                            placeholder="Name (English)"
                            className="form-control"
                            value={project.nameEn}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="nameFr"
                            placeholder="Name (French)"
                            className="form-control"
                            value={project.nameFr}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
            <textarea
                name="descriptionEn"
                placeholder="Description (English)"
                className="form-control"
                value={project.descriptionEn}
                onChange={handleChange}
                required
            />
                    </div>
                    <div className="mb-3">
            <textarea
                name="descriptionFr"
                placeholder="Description (French)"
                className="form-control"
                value={project.descriptionFr}
                onChange={handleChange}
                required
            />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="imageLink"
                            placeholder="Image Link"
                            className="form-control"
                            value={project.imageLink}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="githubLink"
                            placeholder="GitHub Link"
                            className="form-control"
                            value={project.githubLink}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100">
                        Update Project
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProject;

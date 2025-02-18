import { useState } from "react";
import { makeRequest } from "../../AxiosInstance"; // Ensure the correct path
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

const AddProject = () => {
    const [project, setProject] = useState({
        nameEn: "",
        nameFr: "",
        descriptionEn: "",
        descriptionFr: "",
        imageLink: "",
        githubLink: "",
    });

    const handleChange = (e) => {
        setProject({ ...project, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await makeRequest("POST", "/Projects", project);
            alert("Project created successfully!");
        } catch (error) {
            alert("Error creating project: " + (error.response?.data || error.message));
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: "500px" }}>
                <h3 className="text-center mb-4">Create a New Project</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="nameEn"
                            placeholder="Name (English)"
                            className="form-control"
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
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
            <textarea
                name="descriptionEn"
                placeholder="Description (English)"
                className="form-control"
                onChange={handleChange}
                required
            />
                    </div>
                    <div className="mb-3">
            <textarea
                name="descriptionFr"
                placeholder="Description (French)"
                className="form-control"
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
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="githubLink"
                            placeholder="GitHub Link"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Create Project
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProject;

import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const token = localStorage.getItem("authToken");  // Assuming the token is stored in localStorage

    // Fetch files from the server
    const fetchFiles = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/files/", {
                headers: {
                    "Authorization": `Bearer ${token}`,  // Include the token in the Authorization header
                }
            });
            setUploadedFiles(response.data);
        } catch (error) {
            console.error("Error fetching files:", error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    // Handle file drop
    const onDrop = async (acceptedFiles) => {
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
            formData.append("file", file);  // Ensure the field name 'file' matches what the backend expects
            formData.append("fileName", file.name);  // Add fileName for the backend
            formData.append("fileType", file.type);  // Add fileType for the backend
            formData.append("fileSize", file.size);  // Add fileSize for the backend
            formData.append("uploadedBy", "user@example.com");  // Modify as per actual user data
            formData.append("filePath", `uploads/${file.name}`);  // Example, modify as per storage path
        });

        try {
            const response = await axios.post("http://localhost:5000/api/files/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",  // Ensure proper content type
                    "Authorization": `Bearer ${token}`,  // Include the token in the Authorization header
                },
            });
            console.log('File uploaded successfully:', response.data);
            fetchFiles(); // Refresh the file list
        } catch (error) {
            console.error("Error uploading file:", error.response ? error.response.data : error.message);
        }
    };

    // Handle file deletion
    const handleDelete = async (fileId) => {
        try {
            await axios.delete(`http://localhost:5000/api/files/${fileId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,  // Include the token in the Authorization header
                }
            });
            fetchFiles(); // Refresh the file list
        } catch (error) {
            console.error("Error deleting file:", error.response ? error.response.data : error.message);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"], "application/vnd.ms-excel": [".xls", ".xlsx"] },
    });

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="file-upload-container flex-1 p-6">
                <h1>Upload Documents</h1>
                <div
                    {...getRootProps()}
                    className={`dropzone ${isDragActive ? "active" : ""}`}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop your files here...</p>
                    ) : (
                        <p>Drag & drop your files here, or click to select files</p>
                    )}
                </div>

                {uploadedFiles.length > 0 && (
                    <table className="file-table">
                        <thead>
                            <tr>
                                <th>File Name</th>
                                <th>File Type</th>
                                <th>Upload Date</th>
                                <th>Uploaded By</th>
                                <th>File Size</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uploadedFiles.map((file) => (
                                <tr key={file._id}>
                                    <td>{file.fileName}</td>
                                    <td>{file.fileType}</td>
                                    <td>{new Date(file.uploadDate).toLocaleString()}</td>
                                    <td>{file.uploadedBy}</td>
                                    <td>{(file.fileSize / 1024).toFixed(2)} KB</td>
                                    <td>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(file._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default FileUpload;

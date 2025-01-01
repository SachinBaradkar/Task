import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const fetchFiles = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/files/");
            setUploadedFiles(response.data);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const onDrop = async (acceptedFiles) => {
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
            formData.append("files", file);
        });

        try {
            await axios.post("http://localhost:5000/api/files/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            fetchFiles(); // Refresh the file list
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const handleDelete = async (fileId) => {
        try {
            await axios.delete(`http://localhost:5000/api/files/${fileId}`);
            fetchFiles(); // Refresh the file list
        } catch (error) {
            console.error("Error deleting file:", error);
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
                                <tr key={file.id}>
                                    <td>{file.fileName}</td>
                                    <td>{file.fileType}</td>
                                    <td>{file.uploadDate}</td>
                                    <td>{file.uploadedBy}</td>
                                    <td>{file.fileSize}</td>
                                    <td>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(file.id)}
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

import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ theme }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const token = localStorage.getItem("authToken"); // Assuming the token is stored in localStorage

    // Fetch files from the server
    const fetchFiles = async () => {
        try {
            const response = await axios.get("https://task-586i.onrender.com/api/files/", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
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
            formData.append("file", file);
            formData.append("fileName", file.name);
            formData.append("fileType", file.type);
            formData.append("fileSize", file.size);
            formData.append("uploadedBy", "user@example.com");
            formData.append("filePath", `uploads/${file.name}`);
        });

        try {
            const response = await axios.post("https://task-586i.onrender.com/api/files/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            });
            console.log("File uploaded successfully:", response.data);
            fetchFiles();
        } catch (error) {
            console.error("Error uploading file:", error.response ? error.response.data : error.message);
        }
    };

    // Handle file deletion
    const handleDelete = async (fileId) => {
        try {
            await axios.delete(`https://task-586i.onrender.com/api/files/${fileId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            fetchFiles();
        } catch (error) {
            console.error("Error deleting file:", error.response ? error.response.data : error.message);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"], "application/vnd.ms-excel": [".xls", ".xlsx"] },
    });

    return (
        <div className={`flex h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
            <Sidebar theme={theme} />
            <div className="file-upload-container flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Upload Documents</h1>
                <div
                    {...getRootProps()}
                    className={`dropzone border-2 rounded-md p-6 text-center cursor-pointer ${theme === "dark"
                        ? "bg-gray-800 border-gray-600 text-gray-300"
                        : "bg-white border-gray-300 text-gray-700"
                        } ${isDragActive ? (theme === "dark" ? "bg-gray-700" : "bg-gray-200") : ""}`}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop your files here...</p>
                    ) : (
                        <p>Drag & drop your files here, or click to select files</p>
                    )}
                </div>

                {uploadedFiles.length > 0 && (
                    <table
                        className={`file-table w-full mt-6 border-collapse ${theme === "dark" ? "text-gray-300" : "text-gray-700"
                            }`}
                    >
                        <thead>
                            <tr>
                                <th className="border-b p-2">File Name</th>
                                <th className="border-b p-2">File Type</th>
                                <th className="border-b p-2">Upload Date</th>
                                <th className="border-b p-2">Uploaded By</th>
                                <th className="border-b p-2">File Size</th>
                                <th className="border-b p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uploadedFiles.map((file) => (
                                <tr key={file._id}>
                                    <td className="border-b p-2">{file.fileName}</td>
                                    <td className="border-b p-2">{file.fileType}</td>
                                    <td className="border-b p-2">{new Date(file.uploadDate).toLocaleString()}</td>
                                    <td className="border-b p-2">{file.uploadedBy}</td>
                                    <td className="border-b p-2">{(file.fileSize / 1024).toFixed(2)} KB</td>
                                    <td className="border-b p-2">
                                        <button
                                            className={`delete-button p-2 rounded ${theme === "dark" ? "bg-red-600 text-white" : "bg-red-500 text-white"
                                                } hover:opacity-75`}
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

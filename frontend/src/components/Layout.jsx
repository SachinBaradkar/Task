// src/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Layout = () => {
    return (
        <>
            <header style={styles.header}>
                <h1 style={styles.title}>My App</h1>
                <ThemeToggle />
            </header>
            <main style={styles.main}>
                <Outlet />
            </main>
        </>
    );
};

const styles = {
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#2196F3",
        color: "#fff",
    },
    title: {
        margin: 0,
    },
    main: {
        padding: "20px",
    },
};

export default Layout;

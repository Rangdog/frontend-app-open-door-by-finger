import React, { useState } from "react";
import { Container, Typography, AppBar, Toolbar, Button, Alert } from "@mui/material";
import DoorTable from "./components/DoorTable";
import MemberManagement from "./components/MemberManagement";
import HistoryManagement from "./components/HistoryManagement";
import DetailVerify from "./components/DetailVerify";
import DoorManagement from "./components/DoorManagement";
import HistoryFalseManagement from "./components/HistoryFalseManagement";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import Login from "./components/Login";
const App = () => {
    const [currentView, setCurrentView] = useState("doors"); // Trạng thái hiện tại (cửa, thành viên, lịch sử)
    const [selectedHistoryId, setSelectedHistoryId] = useState(null); // ID lịch sử đã chọn

    const handleLogout = () =>{
        localStorage.removeItem('token')
        window.location.href = '/login'
    }
    const isAuthenticated = localStorage.getItem('token')
    const renderView = () => {
        switch (currentView) {
            case "doors":
                return <DoorTable onManageMembers={() => setCurrentView("members")} onViewHistory={() => setCurrentView("history")} onViewDoor = {() => setCurrentView("manageDoor")} onViewHistoryFalse = {() => setCurrentView("historyfalse")}/>;
            case "members":
                return <MemberManagement onBack={() => setCurrentView("doors")} />;
            case "history":
                return (
                    <HistoryManagement onViewDetail={(id) => {
                        setSelectedHistoryId(id);
                        setCurrentView("detail");
                    }} onBack={() => setCurrentView("doors")} />
                );
            case "manageDoor":
                return <DoorManagement onBack={() => setCurrentView("doors")}/>
            case "detail":
                return <DetailVerify historyId={selectedHistoryId} onBack={() => setCurrentView("history")} />;
            case "historyfalse":
                return <HistoryFalseManagement onBack={() => setCurrentView("doors")}/>
            case "login":
                return <Login />
            default:
                return <DoorTable onManageMembers={() => setCurrentView("members")} onViewHistory={() => setCurrentView("history")} onViewDoor = {() => setCurrentView("manageDoor")}  onViewHistoryFalse = {() => setCurrentView("historyfalse")}/>;
        }
    };

    const getTitle = () => {
        switch (currentView) {
            case "doors":
                return "Quản lý cửa ra vào";
            case "members":
                return "Quản lý thành viên";
            case "history":
                return "Quản lý lịch sử";
            case "detail":
                return "Chi tiết xác thực";
            default:
                return "Quản lý cửa ra vào";
        }
    };

    return (

        <Container>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{flexGrow:1}}>{getTitle()}</Typography>
                    {isAuthenticated ? <>
                        <Button color='inherit' onClick={handleLogout}>Logout</Button>
                    </>:<>
                        <Button color='inherit' onClick={() => setCurrentView("login")}>Login</Button>
                    </>}
                </Toolbar>
            </AppBar>
            {renderView()}
        </Container>
    );
};

export default App;
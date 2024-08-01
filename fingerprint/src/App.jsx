import React, { useState } from "react";
import { Container, Typography, AppBar, Toolbar, Button } from "@mui/material";
import DoorTable from "./components/DoorTable";
import MemberManagement from "./components/MemberManagement";
import HistoryManagement from "./components/HistoryManagement";
import DetailVerify from "./components/DetailVerify";
import DoorManagement from "./components/DoorManagement";

const App = () => {
    const [currentView, setCurrentView] = useState("doors"); // Trạng thái hiện tại (cửa, thành viên, lịch sử)
    const [selectedHistoryId, setSelectedHistoryId] = useState(null); // ID lịch sử đã chọn

    const renderView = () => {
        switch (currentView) {
            case "doors":
                return <DoorTable onManageMembers={() => setCurrentView("members")} onViewHistory={() => setCurrentView("history")} onViewDoor = {() => setCurrentView("manageDoor")}/>;
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
            default:
                return <DoorTable onManageMembers={() => setCurrentView("members")} onViewHistory={() => setCurrentView("history")} />;
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
                    <Typography variant="h6">{getTitle()}</Typography>
                </Toolbar>
            </AppBar>
            {renderView()}
        </Container>
    );
};

export default App;
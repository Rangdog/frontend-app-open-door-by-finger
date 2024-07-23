import React, { useState } from 'react';
import DoorList from '../components/DoorList';
import MemberManagement from '../components/MemberManagement';
import HistoryManagement from '../components/HistoryManagement';
import { Container } from '@mui/material';

const Home = () => {
    const [selectedDoorId, setSelectedDoorId] = useState(null);
    const [view, setView] = useState('list'); // list, manageMembers, manageHistory

    const handleManageMembers = (doorId) => {
        setSelectedDoorId(doorId);
        setView('manageMembers');
    };

    const handleManageHistory = (doorId) => {
        setSelectedDoorId(doorId);
        setView('manageHistory');
    };

    return (
        <Container>
            {view === 'list' && (
                <DoorList onManageMembers={handleManageMembers} onManageHistory={handleManageHistory} />
            )}
            {view === 'manageMembers' && (
                <MemberManagement doorId={selectedDoorId} />
            )}
            {view === 'manageHistory' && (
                <HistoryManagement doorId={selectedDoorId} />
            )}
            <button onClick={() => setView('list')}>Quay lại</button>
        </Container>
    );
};

export default Home;
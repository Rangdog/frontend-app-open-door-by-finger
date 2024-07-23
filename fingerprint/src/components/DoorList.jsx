import React, { useEffect, useState } from 'react';
import { getDoors } from '../components/api';
import { Button, List, ListItem, ListItemText, Snackbar } from '@mui/material';

const DoorList = ({ onManageMembers, onManageHistory }) => {
    const [doors, setDoors] = useState([]);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const fetchDoors = async () => {
            try {
                const data = await getDoors();
                setDoors(data);
            } catch (error) {
                setError(error.message);
                setOpenSnackbar(true);
            }
        };

        fetchDoors();
    }, []);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <List>
                {doors.map((door) => (
                    <ListItem key={door.id}>
                        <ListItemText primary={door.door_name} />
                        <Button onClick={() => onManageMembers(door.id)}>Quản lý thành viên</Button>
                        <Button onClick={() => onManageHistory(door.id)}>Quản lý lịch sử</Button>
                    </ListItem>
                ))}
            </List>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={error}
            />
        </>
    );
};

export default DoorList;
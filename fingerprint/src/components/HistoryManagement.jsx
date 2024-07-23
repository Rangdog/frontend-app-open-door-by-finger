import React, { useEffect, useState } from 'react';
import { getHistory } from '../components/api';
import { List, ListItem, ListItemText, Snackbar, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const HistoryManagement = ({ doorId }) => {
    const [history, setHistory] = useState([]);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [entryDetail, setEntryDetail] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getHistory();
                setHistory(data);
            } catch (error) {
                setError(error.message);
                setOpenSnackbar(true);
            }
        };

        fetchHistory();
    }, [doorId]);

    const handleOpenDialog = (entry) => {
        setSelectedEntry(entry);
        setEntryDetail(entry ? entry.detail_verify_id : '');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedEntry(null);
    };

    const handleSave = async () => {
        try {
            if (selectedEntry) {
                // Cập nhật thông tin lịch sử
                await updateHistory(selectedEntry.id, entryDetail); // Giả sử bạn đã định nghĩa phương thức updateHistory
            } else {
                // Thêm lịch sử mới
                await addHistory(entryDetail); // Giả sử bạn đã định nghĩa phương thức addHistory
            }
            handleCloseDialog();
            // Gọi lại danh sách lịch sử
            const data = await getHistory();
            setHistory(data);
        } catch (error) {
            setError(error.message);
            setOpenSnackbar(true);
        }
    };

    const handleDelete = async (entryId) => {
        try {
            await deleteHistory(entryId); // Giả sử bạn đã định nghĩa phương thức deleteHistory
            const data = await getHistory();
            setHistory(data);
        } catch (error) {
            setError(error.message);
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div>
            <h2>Quản lý Lịch sử</h2>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog(null)}>
                Thêm Lịch sử
            </Button>
            <List>
                {history.map((entry) => (
                    <ListItem key={entry.id}>
                        <ListItemText primary={`ID: ${entry.detail_verify_id}, Thời gian: ${entry.time}`} />
                        <Button variant="contained" onClick={() => handleOpenDialog(entry)}>Sửa</Button>
                        <Button variant="contained" color="secondary" onClick={() => handleDelete(entry.id)}>Xóa</Button>
                    </ListItem>
                ))}
            </List>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={error}
            />
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{selectedEntry ? "Sửa Lịch sử" : "Thêm Lịch sử"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Chi tiết xác minh"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={entryDetail}
                        onChange={(e) => setEntryDetail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default HistoryManagement;
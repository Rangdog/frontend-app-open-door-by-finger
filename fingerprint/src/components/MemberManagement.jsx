import React, { useEffect, useState } from 'react';
import { getMembers } from '../components/api';
import { List, ListItem, ListItemText, Snackbar, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const MemberManagement = ({ doorId }) => {
    const [members, setMembers] = useState([]);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [memberName, setMemberName] = useState('');

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const data = await getMembers();
                setMembers(data);
            } catch (error) {
                setError(error.message);
                setOpenSnackbar(true);
            }
        };

        fetchMembers();
    }, [doorId]);

    const handleOpenDialog = (member) => {
        setSelectedMember(member);
        setMemberName(member ? member.name : '');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedMember(null);
    };

    const handleSave = async () => {
        try {
            if (selectedMember) {
                // Cập nhật thông tin thành viên
                await updateMember(selectedMember.id, memberName); // Giả sử bạn đã định nghĩa phương thức updateMember
            } else {
                // Thêm thành viên mới
                await addMember(memberName); // Giả sử bạn đã định nghĩa phương thức addMember
            }
            handleCloseDialog();
            // Gọi lại danh sách thành viên
            const data = await getMembers();
            setMembers(data);
        } catch (error) {
            setError(error.message);
            setOpenSnackbar(true);
        }
    };

    const handleDelete = async (memberId) => {
        try {
            await deleteMember(memberId); // Giả sử bạn đã định nghĩa phương thức deleteMember
            const data = await getMembers();
            setMembers(data);
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
            <h2>Quản lý Thành viên</h2>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog(null)}>
                Thêm Thành viên
            </Button>
            <List>
                {members.map((member) => (
                    <ListItem key={member.id}>
                        <ListItemText primary={member.name} />
                        <Button variant="contained" onClick={() => handleOpenDialog(member)}>Sửa</Button>
                        <Button variant="contained" color="secondary" onClick={() => handleDelete(member.id)}>Xóa</Button>
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
                <DialogTitle>{selectedMember ? "Sửa Thành viên" : "Thêm Thành viên"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Tên thành viên"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
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

export default MemberManagement
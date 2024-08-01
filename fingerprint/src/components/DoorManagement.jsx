import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Snackbar,Typography  } from "@mui/material";
import { getDoors, deleteDoor, updateDoor, createDoor, getHistoryByDoor } from "../api/services";
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DoorManagement = ({onBack}) => {
    const [doors, setDoors] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, doorName: "", location: "" });
    const [imagefile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [doorHistory, setDoorHistory] = useState([]);
    const [currentDoorId, setCurrentDoorId] = useState(null);

    const fetchDoorDetails = async(doorId) =>{
        try{
            const historyData = await getHistoryByDoor(doorId); 
            console.log(historyData)
            setDoorHistory(historyData);
        }
        catch(error){
            console.log("Lỗi lấy dữ liệu: ", error.message)
        }
    }

    const fetchDoors = async () => {
        const data = await getDoors();
        setDoors(data);
    };

    useEffect(() => {
        fetchDoors();
    }, []);

    const handleOpen = (door = { id: null, doorName: "", location: "" }) => {
        setFormData(door);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setFormData({ id: null, doorName: "", location: "" }); // Reset form
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try{
            if (formData.id) {
                // Update door
                await updateDoor(formData.id, formData);
                setSnackbarMessage("Cập nhật cửa thành công!");
            } else {
                // Create door
                await createDoor(formData);
                setSnackbarMessage("Thêm cửa thành công!");
            }
            setSnackbarSeverity("success");
        }
        catch (err){
            console.log(err);
            setSnackbarMessage("Có lỗi xảy ra!");
            setSnackbarSeverity("error");
        }
        handleClose();
        fetchDoors(); // Refresh the list
        setSnackbarOpen(true);
    }

    const handleDelete = async(id) =>{
        try{
            await deleteDoor(id);
            setSnackbarMessage("Xóa cửa thành công!");
            setSnackbarSeverity("success");
        }
        catch(err){
            setSnackbarMessage("Có lỗi xảy ra khi xóa!");
            setSnackbarSeverity("error");
        }
        fetchDoors(); // Refresh the list
        setSnackbarOpen(true);
    }
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };


    const handleDetailOpen = (door) =>{
        setCurrentDoorId(door.id);
        fetchDoorDetails(door.id)
        setDetailDialogOpen(true);
    }
    const handleDetailClose = () =>{
        setDetailDialogOpen(false)
    }
    return (
        <div style={{ padding: '20px' }}>
            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
                <Grid item>
                    <Button variant="contained" onClick={onBack}>Quay lại</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="success" onClick={() => handleOpen()}>Thêm cửa</Button>
                </Grid>
            </Grid>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tên cửa</TableCell>
                            <TableCell>Vị trí</TableCell>
                            <TableCell>Hành Động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {doors.map((door) => (
                            <TableRow key={door.id}>
                                <TableCell>{door.id}</TableCell>
                                <TableCell>{door.doorName}</TableCell>
                                <TableCell>{door.location}</TableCell>
                                <TableCell>
                                        <Button variant="contained" onClick={() => handleOpen(door)} style={{ marginRight: '10px' }}>Sửa</Button>
                                        <Button variant="contained" color="secondary" onClick={() => handleDetailOpen(door)} style={{ marginRight: '10px' }}>Lịch sử</Button>
                                        <Button variant="contained" color="error" onClick={() => handleDelete(door.id)}>Xóa</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{formData.id ? "Cập Nhập Cửa: " + formData.doorName + " - " + formData.id  : "Thêm Cửa"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="doorName"
                        label="Tên Cửa"
                        type="text"
                        fullWidth
                        value={formData.doorName}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="location"
                        label="Vị Trí"
                        type="text"
                        fullWidth
                        value={formData.location}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Hủy</Button>
                    <Button onClick={handleSubmit} color="primary">Lưu</Button>
                </DialogActions>
            </Dialog>
            {/* Dialog for Door History */}
            <Dialog open={detailDialogOpen} onClose={handleDetailClose} maxWidth="md" fullWidth>
                <DialogTitle>Lịch sử cửa {currentDoorId}</DialogTitle>
                <DialogContent>
                    <Typography variant="h6">Lịch sử:</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Thời gian</TableCell>
                                    <TableCell>Tên Cửa</TableCell>
                                    <TableCell>Tên Thành viên</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {doorHistory.map((history, index) => (
                                    <TableRow key={history.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{new Date(history.time).toLocaleString()}</TableCell>
                                        <TableCell>{history.detailVerify?.door?.doorName}</TableCell>
                                        <TableCell>{history.detailVerify?.member?.name}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDetailClose} color="primary">Đóng</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}
export default DoorManagement;
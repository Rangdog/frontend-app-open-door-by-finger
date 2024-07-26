import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Snackbar,Typography, Autocomplete, } from "@mui/material";
import { getDoors, createDoor, deleteDoor, updateDoor, getMembers,createDetailVerify } from "../api/services";
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DoorTable = ({ onManageMembers, onViewHistory }) => {
    const [doors, setDoors] = useState([]);
    const [members, setMembers] = useState([]);
    const [open, setOpen] = useState(false);
    const [formFingerprintRegistration, setformFingerprintRegistration] = useState(false);
    const [formData, setFormData] = useState({ id: null, doorName: "", location: "" });
    const [formDataFingerprintRegistration, setformDataFingerprintRegistration] = useState({id:null, doorId:"", memberId:""});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const fetchDoors = async () => {
        const data = await getDoors();
        setDoors(data);
    };
    const fetchMembers = async () => {
        const data = await getMembers();
        setMembers(data)
    }
    useEffect(() => {
        fetchDoors();
        fetchMembers();
    }, []);

    const handleOpen = (door = { id: null, doorName: "", location: "" }) => {
        setFormData(door);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({ id: null, doorName: "", location: "" }); // Reset form
    };

    const fingerprintRegistration = (id) => {
        const detailVerify = {id:null, doorId:id, memberId:""}
        setformDataFingerprintRegistration(detailVerify);
        setformFingerprintRegistration(true);
    }

    const handleCloseFingerprintRegistration = () => {
        setformFingerprintRegistration(false);
        setformDataFingerprintRegistration({id:null, doorId:"", memberId:""}); // Reset form
    }

    const handleSubmitFingerprintRegistration = async(e) => {
        console.log(formDataFingerprintRegistration)
        e.preventDefault();
        try{
            await createDetailVerify(formDataFingerprintRegistration)
            setSnackbarMessage("Đăng ký dấu vân tay thành công!");
            setSnackbarSeverity("success");
        }
        catch(e){
            setSnackbarMessage("Có lỗi xảy ra khi đăng ký!");
            setSnackbarSeverity("error");
        }
        handleCloseFingerprintRegistration();
        fetchDoors();
        setSnackbarOpen(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
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
            setSnackbarMessage("Có lỗi xảy ra!");
            setSnackbarSeverity("error");
        }
        handleClose();
        fetchDoors(); // Refresh the list
        setSnackbarOpen(true);
    };

    const handleDelete = async (id) => {
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
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
                <Grid item>
                    <Button variant="contained" onClick={onManageMembers}>Quản lý thành viên</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={onViewHistory}>Quản lý lịch sử</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="success" onClick={() => handleOpen()}>Thêm Cửa</Button>
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
                                        <Button variant="contained" color="secondary" onClick={() => fingerprintRegistration(door.id)} style={{ marginRight: '10px' }}>Đăng ký vân tay</Button>
                                        <Button variant="contained" color="secondary" onClick={() => fingerprintRegistration(door.id)} style={{ marginRight: '10px' }}>Chi tiết</Button>
                                        <Button variant="contained" color="success" onClick={() => fingerprintRegistration(door.id)} style={{ marginRight: '10px' }}>Mở cửa</Button>
                                        <Button variant="contained" color="error" onClick={() => handleDelete(door.id)}>Xóa</Button>
                                        
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{formData.id ? "Cập Nhật Cửa" : "Thêm Cửa"}</DialogTitle>
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
            <Dialog open={formFingerprintRegistration} onClose = {handleCloseFingerprintRegistration}>
                        <DialogTitle>Đằng ký dấu vân tay</DialogTitle>
                        <DialogContent>
                            <Autocomplete
                                options={members}
                                getOptionLabel = {(option) => option.name}
                                onChange = {(event, newvalue) =>{
                                    setformDataFingerprintRegistration({
                                        ...formDataFingerprintRegistration,
                                        memberId: newvalue?newvalue.id:""
                                    });
                                }}
                                renderInput={(params) =>(
                                    <TextField {...params} label="Chọn thành viên" variant="outlined" fullWidth/>
                                )}
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseFingerprintRegistration} color="primary">Hủy</Button>
                            <Button onClick={handleSubmitFingerprintRegistration} color="primary">Lưu</Button>
                        </DialogActions>
            </Dialog>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default DoorTable;
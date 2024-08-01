import React, { useEffect, useState, useCallback } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Snackbar,Typography, Autocomplete, InputAdornment, Select, MenuItem  } from "@mui/material";
import { getDoors, createDoor, deleteDoor, updateDoor, getMembers,createDetailVerify,getMembersByDoor, getHistoryByDoor, verifyFingerprint, deleteDetailVerify, ResetFingerPrint, getMemberForDoor, verifyFingerprintByModel2  } from "../api/services";
import MuiAlert from '@mui/material/Alert';
import { debounce } from 'lodash';
import SearchIcon from '@mui/icons-material/Search';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DoorTable = ({ onManageMembers, onViewHistory, onViewDoor }) => {
    const [doors, setDoors] = useState([]);
    const [members, setMembers] = useState([]);
    const [open, setOpen] = useState(false);
    const [formFingerprintRegistration, setformFingerprintRegistration] = useState(false);
    const [formData, setFormData] = useState({ id: null, doorName: "", location: "" });
    const [formDataFingerprintRegistration, setformDataFingerprintRegistration] = useState({id:null, door: {id:""}, member:{id:""}});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemType, setItemType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    //
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [doorMembers, setDoorMembers] = useState([]);
    const [doorHistory, setDoorHistory] = useState([]);
    //
    const [selectedFile, setSelectedFile] = useState(null);
    const [unlockDialogOpen, setUnlockDialogOpen] = useState(false);
    const [currentDoorId, setCurrentDoorId] = useState(null);

    const [selectedModel, setSelectedModel] = useState('model1'); // State to store selected model

    const fetchDoors = async () => {
        const data = await getDoors();
        setDoors(data);
    };
    const fetchMembers = async () => {
        const data = await getMemberForDoor(currentDoorId);
        setMembers(data)
    }

    const fetchDoorDetails = async(doorId) =>{
        try{
            const membersData = await getMembersByDoor(doorId); 
            const historyData = await getHistoryByDoor(doorId); 
            console.log(membersData)
            console.log(historyData)
            setDoorMembers(membersData);
            setDoorHistory(historyData);
        }
        catch(error){
            console.log("Lỗi lấy dữ liệu: ", error.message)
        }
    }

    useEffect(() =>{
        fetchMembers()
    }, [currentDoorId])

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

    const handleFingerPrint = async() =>{
        try{
            const result = await ResetFingerPrint(); 
            setSnackbarMessage("Thành công");  
            setSnackbarSeverity("success");
        }
        catch(error){
            setSnackbarMessage("Có lỗi xảy ra: " + error);
            setSnackbarSeverity("error");
        }
        fetchDoors();
        setSnackbarOpen(true)
    }

    const fingerprintRegistration = (id) => {
        const detailVerify = {id:null, door: {id:id}, member:{id:""}}
        setformDataFingerprintRegistration(detailVerify);
        setformFingerprintRegistration(true);
        setCurrentDoorId(id)
    }

    const handleCloseFingerprintRegistration = () => {
        setformFingerprintRegistration(false);
        setformDataFingerprintRegistration({id:null, door: {id:""}, member:{id:""}}); // Reset form
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

    const handleDetailOpen = (door) =>{
        setCurrentDoorId(door.id);
        fetchDoorDetails(door.id)
        setDetailDialogOpen(true);
    }

    const handleDetailClose = () =>{
        setDetailDialogOpen(false)
    }

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
      };
      
    const handleUnlockOpen = (doorId) => {
        setCurrentDoorId(doorId);
        setUnlockDialogOpen(true);
    };
    
    const handleUnlockClose = () => {
        setUnlockDialogOpen(false);
        setSelectedFile(null);
        setCurrentDoorId(null);
    };

    const handleUnlock = async () => {
        if(selectedModel === 'model1'){
            if (!selectedFile || !currentDoorId) {
                setSnackbarMessage("Vui lòng chọn file hình ảnh vân tay");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                return;
            }
            
            try {
                const result = await verifyFingerprint(currentDoorId, selectedFile);
                console.log(result.message)
                console.log(result.label)
                console.log(result.message === 'Mở cửa thành công! Xin chào ' + result.label)
                // Kiểm tra phản hồi từ API
                if (result.message && result.message.includes('Mở cửa thành công! Xin chào')) {
                    setSnackbarMessage(result.message);  // Sử dụng thông báo từ server
                    setSnackbarSeverity("success");
                } else if (result.message === 'Bạn không có quyền mở cửa này.') {
                    setSnackbarMessage(result.message); // Thông báo không có quyền
                    setSnackbarSeverity("error");
                } else if (result.message === 'Dấu vân tay của bạn chưa có trong cơ sở dữ liệu.') {
                    setSnackbarMessage(result.message); // Thông báo không tìm thấy vân tay
                    setSnackbarSeverity("error");
                } else {
                    setSnackbarMessage("Mở cửa thất bại! Lỗi không xác định.");
                    setSnackbarSeverity("error");
                }
            } catch (error) {
                setSnackbarMessage("Có lỗi xảy ra khi xác thực vân tay");
                setSnackbarSeverity("error");
            }
            setSnackbarOpen(true);
            handleUnlockClose();
        }
        else{
            if (!selectedFile || !currentDoorId) {
                setSnackbarMessage("Vui lòng chọn file hình ảnh vân tay");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                return;
            }
            
            try {
                const result = await verifyFingerprintByModel2(currentDoorId, selectedFile);
                console.log(result.message)
                console.log(result.label)
                console.log(result.message === 'Mở cửa thành công! Xin chào ' + result.label)
                // Kiểm tra phản hồi từ API
                if (result.message && result.message.includes('Mở cửa thành công! Xin chào')) {
                    setSnackbarMessage(result.message);  // Sử dụng thông báo từ server
                    setSnackbarSeverity("success");
                } else if (result.message === 'Bạn không có quyền mở cửa này.') {
                    setSnackbarMessage(result.message); // Thông báo không có quyền
                    setSnackbarSeverity("error");
                } else if (result.message === 'Dấu vân tay của bạn chưa có trong cơ sở dữ liệu.') {
                    setSnackbarMessage(result.message); // Thông báo không tìm thấy vân tay
                    setSnackbarSeverity("error");
                } else {
                    setSnackbarMessage("Mở cửa thất bại! Lỗi không xác định.");
                    setSnackbarSeverity("error");
                }
            } catch (error) {
                setSnackbarMessage("Có lỗi xảy ra khi xác thực vân tay");
                setSnackbarSeverity("error");
            }
            setSnackbarOpen(true);
            handleUnlockClose();
        }
    };

    const handleDeleteDetailVerify = async (door_Id, member_Id) => {
        try{
            await deleteDetailVerify(door_Id, member_Id);
            setSnackbarMessage("Xóa cửa thành công!");
            setSnackbarSeverity("success");
        }
        catch(err){
            console.log(err)
            setSnackbarMessage("Có lỗi xảy ra khi xóa!");
            setSnackbarSeverity("error");
        }
        fetchDoors(); // Refresh the list
        setSnackbarOpen(true);
    }

    const openConfirmDeleteDialog  = (data,type) =>{
        setItemToDelete(data);
        setItemType(type);
        setConfirmDeleteOpen(true);
    }

    const debouncedSearch = useCallback(
        debounce((searchValue) => {
          setSearchTerm(searchValue);
        }, 300),
        []
      );

    const handleSearchChange = (event) => {
        debouncedSearch(event.target.value);
    };

    const filteredDoors = doors.filter(door => 
        door.doorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        door.location.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return (
        <div style={{ padding: '20px' }}>
            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
                <Grid item>
                    <Button variant="contained" onClick={onViewDoor}>Quản lý cửa</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={onManageMembers}>Quản lý thành viên</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={onViewHistory}>Quản lý lịch sử</Button>
                </Grid>
                {/* <Grid item>
                    <Button variant="contained" color="success" onClick={() => handleOpen()}>Thêm Cửa</Button>
                </Grid> */}
                <Grid item>
                    <Button variant="contained" color="error" onClick={() => handleFingerPrint()}>Reset Fingerprint</Button>
                </Grid>
            </Grid>
            <TextField
                label="Tìm kiếm theo tên cửa và vị trí"
                variant="outlined"
                onChange={handleSearchChange}
                style={{ marginBottom: '20px', width: '100%' }}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                    ),
                }}
                />
                <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>
                Tìm thấy {filteredDoors.length} kết quả
                </Typography>
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
                    {filteredDoors.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                            Không tìm thấy cửa nào phù hợp
                            </TableCell>
                        </TableRow>
                        ) : (
                            filteredDoors.map((door) => (
                            <TableRow key={door.id}>
                                <TableCell>{door.id}</TableCell>
                                <TableCell>{door.doorName}</TableCell>
                                <TableCell>{door.location}</TableCell>
                                <TableCell>
                                        {/* <Button variant="contained" onClick={() => handleOpen(door)} style={{ marginRight: '10px' }}>Sửa</Button> */}
                                        <Button variant="contained" color="secondary" onClick={() => fingerprintRegistration(door.id)} style={{ marginRight: '10px' }}>Đăng ký vân tay</Button>
                                        <Button variant="contained" color="secondary" onClick={() => handleDetailOpen(door)} style={{ marginRight: '10px' }}>Chi tiết</Button>
                                        <Button variant="contained" color="success" onClick={() => handleUnlockOpen(door.id)} style={{ marginRight: '10px' }}>Mở cửa</Button>
                                        {/* <Button variant="contained" color="error" onClick={() => openConfirmDeleteDialog(door.id, "door")}>Xóa</Button> */}        
                                </TableCell>
                            </TableRow>
                        ))
                        )}
                        
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
            {/* Dialog for Fingerprint Registration */}
            <Dialog open={formFingerprintRegistration} onClose = {handleCloseFingerprintRegistration}>
                        <DialogTitle>Đằng ký dấu vân tay</DialogTitle>
                        <DialogContent>
                            <Autocomplete
                                options={members}
                                getOptionLabel = {(option) => option.name}
                                onChange = {(event, newvalue) =>{
                                    setformDataFingerprintRegistration({
                                        ...formDataFingerprintRegistration,
                                        member: newvalue ? { id: newvalue.id } : null
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

            {/* Dialog for confirm delete */}
            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
                <DialogTitle>Xác Nhận Xóa</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn xóa {itemType === 'door' ? 'cửa này' : 'thành viên này'} không?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">Hủy</Button>
                    <Button onClick={() => {
                        if (itemType === 'door') {
                            handleDelete(itemToDelete); // Gọi hàm xóa cửa
                        } else if (itemType === 'member') {
                            handleDeleteMember(itemToDelete); // Gọi hàm xóa thành viên
                        }
                        setConfirmDeleteOpen(false); // Đóng dialog
                    }} color="primary">Xóa</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for Door Members and History */}
            <Dialog open={detailDialogOpen} onClose={handleDetailClose} maxWidth="md" fullWidth>
                <DialogTitle>Chi tiết cửa</DialogTitle>
                <DialogContent>
                    <Typography variant="h6">Danh sách thành viên:</Typography>
                    <TableContainer style={{ marginBottom: '20px' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Tên thành viên</TableCell>
                                    <TableCell>Dấu vân tay</TableCell>
                                    <TableCell>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {doorMembers.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell>{member.id}</TableCell>
                                        <TableCell>{member.name}</TableCell>
                                        <TableCell>{member.fingerprint}</TableCell>
                                        <TableCell><Button variant="contained" color="error" onClick={() => handleDeleteDetailVerify(currentDoorId, member.id)}>Xóa</Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
{/* 
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
                    </TableContainer> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDetailClose} color="primary">Đóng</Button>
                </DialogActions>
            </Dialog>
            {/* Dialog for Unlock Door */}
            <Dialog open={unlockDialogOpen} onClose={handleUnlockClose}>
                <DialogTitle>Mở cửa bằng vân tay</DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>
                        Chọn model:
                    </Typography>
                    <Select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        fullWidth
                        style={{ marginBottom: '20px' }}
                    >
                        <MenuItem value="model1">Model 1</MenuItem>
                        <MenuItem value="model2">Model 2</MenuItem>
                    </Select>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ marginBottom: '20px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUnlockClose} color="primary">Hủy</Button>
                    <Button onClick={handleUnlock} color="primary">Xác nhận</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default DoorTable;
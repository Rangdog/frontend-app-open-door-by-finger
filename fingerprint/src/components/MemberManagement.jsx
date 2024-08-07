import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Snackbar,Typography  } from "@mui/material";
import { deleteMember, getMembers, updateMember, createMember, getHistoryByMemberID } from "../api/services";
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const MemberManagement = ({ onBack }) => { // Nhận prop onBack
    const [members, setMembers] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, fingerprint: "", name: "" });
    const [imagefile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");


    const [historiesOpen, setHistoriesOpen] = useState(false);
    const [memberHistory, setMemberHistory] = useState([]);
    const [currentMemberID, setCurrentMemberID] = useState(null);

    const fetchMembers = async () => {
        const data = await getMembers();
        setMembers(data);
    };

    const fetchMemberHistory = async(memberID) =>{
        try{
            const historyData = await getHistoryByMemberID(memberID); 
            console.log(historyData)
            setMemberHistory(historyData);
        }
        catch(error){
            console.log("Lỗi lấy dữ liệu: ", error.message)
        }
    }

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleOpen = (member = {id: null, fingerprint: "", name:""}) => {
        setFormData(member);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setFormData({id:null, fingerprint: "", name: ""});
    }

    const handleChange = (e) =>{
        const {name,value} = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        const formDataSend = new FormData()
        formDataSend.append("fingerprint", formData.fingerprint);
        formDataSend.append("name", formData.name);
        console.log("Image File Name:", imagefile.name);
        console.log("Image File Type:", imagefile.type);
        if(imagefile){
            formDataSend.append("file", imagefile);
        }
        for (const [key, value] of formDataSend.entries()) {
            console.log(`${key}: ${value}`);
        }
        try{
            if(formData.id){
                // Update member
                await updateMember(formData.id, formDataSend)
                setSnackbarMessage("Cập nhật thành viên thành công!");
            }
            else{
                // Create member
                await createMember(formDataSend)
                setSnackbarMessage("Thêm thành viên thành công!");
            }
            setSnackbarSeverity("success");
        }
        catch{
            setSnackbarMessage("Có lỗi xảy ra!");
            setSnackbarSeverity("error");
        }
        handleClose();
        fetchMembers();
        setSnackbarOpen(true);
    }

    const handleDelete = async(id) =>{
        try{
            await deleteMember(id);
            setSnackbarMessage("Xóa thành viên thành công!");
            setSnackbarSeverity("success");
        }
        catch{
            setSnackbarMessage("Có lỗi xảy ra khi xóa!");
            setSnackbarSeverity("error");
        }
        fetchMembers();
        setSnackbarOpen(true);
    }
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleImageChange = (e) =>{
        const file = e.target.files[0];
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const handleHistoriesOpen = (member) =>{
        setCurrentMemberID(member.id);
        fetchMemberHistory(member.id)
        setHistoriesOpen(true);
    }
    const handleDetailClose = () =>{
        setHistoriesOpen(false)
    }
    return (
        <div style={{ padding: '20px' }}>
            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
                <Grid item>
                    <Button variant="contained" onClick={onBack}>Quay lại</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={() => handleOpen()}>Thêm thành viên</Button>
                </Grid>
            </Grid>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Dấu vân tay</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Hành Động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {members.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell>{member.id}</TableCell>
                                <TableCell>{member.fingerprint}</TableCell>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>
                                        <Button variant="contained" onClick={() => handleOpen(member)} style={{ marginRight: '10px' }}>Sửa</Button>
                                        <Button variant="contained" color="secondary" onClick={() => handleHistoriesOpen(member)} style={{ marginRight: '10px' }}>Lịch sử</Button>
                                        <Button variant="contained" color="error" onClick={() => handleDelete(member.id)}>Xóa</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{formData.id ? "Cập Nhật Thành Viên" : "Thêm Thành Viên"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="fingerprint"
                        label="Mã Dấu Vân Tay"
                        type="number"
                        fullWidth
                        value={formData.fingerprint}
                        onChange={handleChange}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Tên Thành Viên"
                        type="text"
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {!formData.id ? <div style={{marginTop: '20px'}}>
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{display: 'block', marginTop: '10px'}}/>
                        <Typography variant="caption" color="textSecondary">
                            Chọn hình ảnh dấu vân tay (Chỉ hỗ trợ hình ảnh).
                        </Typography>
                        {imagePreview && (<img src = {imagePreview} alt="preview" style={{marginTop : '10px', width:'96px', maxHeight:'96px', objectFit:'cover'}}
                            
                            />
                        )}
                    </div>
                    : ""}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Hủy</Button>
                    <Button onClick={handleSubmit} color="primary">Lưu</Button>
                </DialogActions>
            </Dialog>
            {/* Dialog for Door History */}
            <Dialog open={historiesOpen} onClose={handleDetailClose} maxWidth="md" fullWidth>
                <DialogTitle>Lịch sử thành viên: {currentMemberID}</DialogTitle>
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
                                {memberHistory.map((history, index) => (
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
};

export default MemberManagement;
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Snackbar,Typography  } from "@mui/material";
import { deleteMember, getMembers, updateMember, createMember } from "../api/services";
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

    const fetchMembers = async () => {
        const data = await getMembers();
        setMembers(data);
    };

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
        if(imagefile){
            formDataSend.append("imagePath", imagefile);
        }
        try{
            if(formData.id){
                // Update member
                await updateMember(formData.id, formData)
                setSnackbarMessage("Cập nhật thành viên thành công!");
            }
            else{
                // Create member
                await createMember(formData)
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
                        label="mã dấu vân tay"
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
                        {imagePreview && (<img src = {imagePreview} alt="preview" style={{marginTop : '10px', width:'100%', maxHeight:'200px', objectFit:'cover'}}
                            
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
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default MemberManagement;
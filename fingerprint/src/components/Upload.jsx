import React, { useState } from "react";
import axios from 'axios';
import { Button, TextField, Typography, Container, Box, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert'
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const Upload = () => {
    const [file, setFile] = useState(null);
    const [label, setLabel] = useState("");
    const [open, setOpen] = useState(false)
    const [msg, setMsg] = useState('')
    const [severity, setSeverity] = useState('success')

    const handelFileChange = (e) =>{
        setFile(e.target.files[0])
    };

    const handelLabelChange = (e)=>{
        setLabel(e.target.value)
    };

    const handelSubmit = async (e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file)
        formData.append('label', label)
        try{
            const res = await axios.post('http://localhost:5000/api/upload', formData)
            setMsg(res.data.message);
            setSeverity('success');
            setOpen(true)
        }
        catch(e){
            setMsg('There was an error add new the file!');
            setSeverity('error');
            setOpen(true);
        }
        console.log("upload")
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      };
    return (
        <Container>
            <Typography variant = "h4" gutterBottom>
                Upload New FingerPrint
            </Typography>
            <form onSubmit = {handelSubmit}>
                <Box mb={2}>
                    <TextField type ="file" fullWidth onChange={handelFileChange}/>
                </Box>
                <Box mb={2}>
                    <TextField type = "number" label = "Label" fullWidth value = {label} onChange = {handelLabelChange}/>
                </Box>
                <Box>
                    <Button variant = "contained" color = "primary" type = "submit">
                        Upload
                    </Button>
                </Box>
            </form>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity}>
                {msg}
                </Alert>
            </Snackbar>
        </Container>
    )
};

export default Upload;
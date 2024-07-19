import React, { useState } from "react";
import axios from 'axios';
import { Button, TextField, Typography, Container, Box, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert'


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const verify = () => {
    const [file, setFile] = useState(null);
    const [open, setOpen] = useState(false)
    const [msg, setMsg] = useState('')
    const [severity, setSeverity] = useState('success')
    
    const handelFileChange = (e) =>{
        setFile(e.target.files[0])
    };


    const handelSubmit = async (e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file)
        try{
            const res = await axios.post('http://localhost:5000/api/verify' ,formData)
            setMsg(res.data.message + res.data.label + res.data.similarities);
            setSeverity('success');
            setOpen(true)
        }
        catch (error){
            setMsg('There was an error verifying the file!');
            setSeverity('error');
            setOpen(true);
        }
        
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
                verify FingerPrint
            </Typography>
            <form onSubmit = {handelSubmit}>
                <Box mb={2}>
                    <TextField type ="file" fullWidth onChange={handelFileChange}/>
                </Box>
                <Box>
                    <Button variant = "contained" color = "primary" type = "submit">
                        verify
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

export default verify;
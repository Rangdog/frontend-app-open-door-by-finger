import React, {useState} from "react";
import { TextField, Button, Typography, Container, Snackbar } from "@mui/material";
import { register } from "../api/services";
import {useNavigate} from 'react-router-dom'
const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate()

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setError('')
        setSuccess('');
        if(password !== confirmPassword){
            setError('Passwords do not match')
            setOpenSnackbar(true)
            return
        }
        try{
            const response = register(username, password, email)
            console.log(response)
            // setTimeout(() =>{
            //     navigate('/login?registered=true')
            // }, 2000)
        }
        catch (error){
            console.log(error)
            setError(err.response || 'Registration failed')
            setOpenSnackbar(true)
        }
    }
    const handleSnackbarClose = () =>{
        setOpenSnackbar(false)
        setError('')
        setSuccess('')
    }
    return (
        <Container component="main" maxWidth="xs" style={{ marginTop: '100px' }}>
            <Typography variant="h4">Đăng ký</Typography>
            {error && <Typography color={error}> {error} </Typography>}
            {success && <Typography color="primary">{success}</Typography>}
            <form onSubmit={handleSubmit}>
                <TextField 
                    label = "Username"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField 
                    label = "password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField 
                    label = "Confirm Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <TextField 
                    label = "Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary">Đăng ký</Button>
            </form>
            <Snackbar
                open ={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message = {error || success}
            />
        </Container>
    );
}
export default Register
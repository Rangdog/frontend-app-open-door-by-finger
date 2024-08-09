import React, {useState, useEffect } from "react";
import {TextField, Button, Container, Typography, Snackbar} from '@mui/material'
import { login } from "../api/services";
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
const Login = () =>{
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const location = useLocation()
    const navigate = useNavigate();
    useEffect(() =>{
        const params = new URLSearchParams(location.search);
        if(params.get('registered') === 'true'){
            setSuccess("Đăng ký thành công!")
            setOpenSnackbar(true)
        }
    },[location])
    const handleSubmit = async (e) =>{
        e.preventDefault();
        setError('')
        setSuccess('')
        try{
            const response = await login(username, password);
            console.log(response.jwt)
            localStorage.setItem('token', response.jwt)
            setSuccess('Login successful!')
            setOpenSnackbar(true)
            window.location.href = '/'
        }
        catch(error){
            setError('Invalid username or password');
            setOpenSnackbar(true);
        }
    }
    const handleSnackbarClose = () =>{
        setOpenSnackbar(false)
        setError('')
        setSuccess('')
    }
    return(
        <Container maxWidth="sm" style={{ marginTop: '100px' }}>
            <Typography variant="h4">Đăng nhập</Typography>
            <form onSubmit={handleSubmit}>
                <TextField label = "Tên đăng nhập "
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField 
                    label="Mật khẩu"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button type="submit" variant="contained" color = "primary">Đăng nhập</Button>
            </form>
            <Snackbar 
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={error || success}
            />
        </Container>
    );
}
export default Login
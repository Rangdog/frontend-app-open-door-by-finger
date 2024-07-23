import React from 'react';
import Home from './pages/home';
import { CssBaseline, AppBar, Toolbar, Typography } from '@mui/material';

const App = () => {
    return (
        <CssBaseline>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Quản lý Cửa</Typography>
                </Toolbar>
            </AppBar>
            <Home />
        </CssBaseline>
    );
};

export default App;
import { useState } from 'react'
import {Container, Typography, Box } from '@mui/material'
import './App.css'

import Upload from './components/Upload'
import Verify from './components/Verify'

function App() {
  return (
    <Container>
      <Typography variant="h2" align="center" gutterBottom>
          FingerPrint APP
      </Typography>
      <Box mb={5}>
        <Upload/>
      </Box>
      <Box mb={5}>
        <Verify/>
      </Box>
    </Container>
  )
}

export default App

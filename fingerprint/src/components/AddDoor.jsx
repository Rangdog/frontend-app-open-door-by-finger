import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

const AddDoor = ({ open, handleClose, onDoorAdded }) => {
  const [doorName, setDoorName] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/doors', {
        door_name: doorName,
        location,
        password,
      });
      setDoorName('');
      setLocation('');
      setPassword('');
      handleClose();
      onDoorAdded(); // Gọi hàm để cập nhật danh sách cửa
    } catch (error) {
      console.error('Failed to add door', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Thêm Cửa Mới</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tên Cửa"
          type="text"
          fullWidth
          variant="outlined"
          value={doorName}
          onChange={(e) => setDoorName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Địa Điểm"
          type="text"
          fullWidth
          variant="outlined"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Mật Khẩu"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDoor;
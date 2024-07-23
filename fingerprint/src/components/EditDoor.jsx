import React, { useState, useEffect } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

const EditDoor = ({ open, handleClose, door, onDoorUpdated }) => {
  const [doorName, setDoorName] = useState(door.door_name);
  const [location, setLocation] = useState(door.location);
  const [password, setPassword] = useState(door.password);

  useEffect(() => {
    setDoorName(door.door_name);
    setLocation(door.location);
    setPassword(door.password);
  }, [door]);

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/doors/${door.id}`, {
        door_name: doorName,
        location,
        password,
      });
      handleClose();
      onDoorUpdated(); // Gọi hàm để cập nhật danh sách cửa
    } catch (error) {
      console.error('Failed to update door', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Sửa Thông Tin Cửa</DialogTitle>
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
          Cập Nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDoor;
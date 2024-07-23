import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

const AddMember = ({ open, handleClose, onMemberAdded }) => {
  const [fingerprint, setFingerprint] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/members', {
        fingerprint,
        name,
      });
      setFingerprint('');
      setName('');
      handleClose();
      onMemberAdded(); // Gọi hàm để cập nhật danh sách thành viên
    } catch (error) {
      console.error('Failed to add member', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Thêm Thành Viên Mới</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Fingerprint"
          type="text"
          fullWidth
          variant="outlined"
          value={fingerprint}
          onChange={(e) => setFingerprint(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Tên"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

export default AddMember;
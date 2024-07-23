// src/components/EditMember.jsx
import React, { useState, useEffect } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

const EditMember = ({ open, handleClose, member, onMemberUpdated }) => {
  const [fingerprint, setFingerprint] = useState(member.fingerprint);
  const [name, setName] = useState(member.name);

  useEffect(() => {
    setFingerprint(member.fingerprint);
    setName(member.name);
  }, [member]);

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/members/${member.id}`, {
        fingerprint,
        name,
      });
      handleClose();
      onMemberUpdated(); // Gọi hàm để cập nhật danh sách thành viên
    } catch (error) {
      console.error('Failed to update member', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Sửa Thông Tin Thành Viên</DialogTitle>
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
          Cập Nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMember;
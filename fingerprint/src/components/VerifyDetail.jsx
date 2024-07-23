import React from 'react';
import { Typography } from '@mui/material';

const VerifyDetail = ({ detail }) => {
  return (
    <div>
      <Typography variant="h6">Chi Tiết Xác Nhận</Typography>
      <Typography>ID: {detail.id}</Typography>
      <Typography>Cửa: {detail.door_id}</Typography>
      <Typography>Thành Viên: {detail.member_id}</Typography>
    </div>
  );
};

export default VerifyDetail;
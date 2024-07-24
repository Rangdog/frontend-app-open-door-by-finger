import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import { getHistory } from "../components/api";

const HistoryManagement = ({ onViewDetail, onBack }) => { // Nhận prop onBack
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const data = await getHistory();
            setHistory(data);
        };

        fetchHistory();
    }, []);

    return (
        <div>
            <Button variant="contained" onClick={onBack}>Quay lại</Button> {/* Nút quay lại */}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Chi tiết xác thực</TableCell>
                            <TableCell>Thời gian</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {history.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.detail_verify_id}</TableCell>
                                <TableCell>{item.time}</TableCell>
                                <TableCell>
                                    <Button variant="contained" onClick={() => onViewDetail(item.detail_verify_id)}>Xem chi tiết</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default HistoryManagement;
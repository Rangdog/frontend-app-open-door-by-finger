import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Grid } from "@mui/material";
import { getHistories } from "../api/services";
import { format } from 'date-fns'; // Import date-fns
import { DatePicker } from '@mui/x-date-pickers'; // Import MUI DatePicker
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Import Adapter for date-fns
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // Import LocalizationProvider

const HistoryFalseManagement = ({ onViewDetail, onBack }) => { // Nhận prop onBack
    const [history, setHistory] = useState([]);
    const [searchMode, setSearchMode] = useState("door"); // "door" hoặc "member"
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState(null); // State for the selected date

    useEffect(() => {
        const fetchHistory = async () => {
            const data = await getHistories();
            setHistory(data);
            console.log(data);
        };

        fetchHistory();
    }, []);

    // Hàm để lọc dữ liệu theo chế độ tìm kiếm
    const filteredHistory = history.filter(item => {
        const itemDate = new Date(item.time);
        const isDateMatch = selectedDate ? 
            itemDate.toDateString() === selectedDate.toDateString() : true; // Compare dates

        if (searchMode === "door") {
            return (
                (item.detailVerify.door.doorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.detailVerify.door.id.toString().includes(searchTerm)) && isDateMatch
            );
        } else if (searchMode === "member") {
            return (
                (item.detailVerify.member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.detailVerify.member.id.toString().includes(searchTerm)) && isDateMatch
            );
        }
        return true; // Không có bộ lọc
    });

    return (
        <div style={{ padding: '20px' }}>
            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
                <Grid item>
                    <Button variant="contained" onClick={onBack}>Quay lại</Button>
                </Grid>
            </Grid>
            <div>
                <Button variant={searchMode === "door" ? "contained" : "outlined"} onClick={() => setSearchMode("door")}>
                    Tìm kiếm theo cửa
                </Button>
                <Button variant={searchMode === "member" ? "contained" : "outlined"} onClick={() => setSearchMode("member")}>
                    Tìm kiếm theo thành viên
                </Button>
                {/* Date Picker for Date Filtering */}
                <LocalizationProvider dateAdapter={AdapterDateFns} style={{ marginLeft: '20px' }}>
                    <DatePicker
                        label="Chọn ngày"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        renderInput={(params) => <TextField {...params} variant="outlined" margin="normal" fullWidth />}
                    />
                </LocalizationProvider>
            </div>
            <TextField
                label={searchMode === "door" ? "Tên cửa hoặc ID cửa" : "Tên thành viên hoặc ID thành viên"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
            />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell colSpan={2}>Cửa</TableCell> {/* Gộp 2 cột Tên cửa và ID cửa */}
                            <TableCell colSpan={2}>Thành viên</TableCell> {/* Gộp 2 cột Tên thành viên và ID thành viên */}
                            <TableCell>Thời gian</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell></TableCell> {/* Ô trống cho ID */}
                            <TableCell>Tên cửa</TableCell> {/* Tên cửa */}
                            <TableCell>ID cửa</TableCell> {/* ID cửa */}
                            <TableCell>Tên thành viên</TableCell> {/* Tên thành viên */}
                            <TableCell>ID thành viên</TableCell> {/* ID thành viên */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredHistory.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.detailVerify.door.doorName}</TableCell>
                                <TableCell>{item.detailVerify.door.id}</TableCell>
                                <TableCell>{item.detailVerify.member.name}</TableCell>
                                <TableCell>{item.detailVerify.member.id}</TableCell>
                                <TableCell>
                                    {
                                        // Sử dụng date-fns để định dạng thời gian
                                        format(new Date(item.time), 'dd/MM/yyyy HH:mm:ss')
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default HistoryFalseManagement;
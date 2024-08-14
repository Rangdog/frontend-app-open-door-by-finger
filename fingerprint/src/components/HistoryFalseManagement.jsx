import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Grid } from "@mui/material";
import { getHistoriesFalse } from "../api/services";
import { format } from 'date-fns'; // Import date-fns
import { DatePicker } from '@mui/x-date-pickers'; // Import MUI DatePicker
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Import Adapter for date-fns
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // Import LocalizationProvider

const HistoryManagement = ({ onViewDetail, onBack }) => { // Nhận prop onBack
    const [history, setHistory] = useState([]);
    const [searchMode, setSearchMode] = useState("door"); // "door" hoặc "member"
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState(null); // State for the selected date
    useEffect(() => {
        const fetchHistory = async () => {
            const data = await getHistoriesFalse();
            setHistory(data);
            console.log(data)
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
                item.door.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) && isDateMatch // Tìm kiếm theo ID cửa
            );
        } else if (searchMode === "member") {
            return (
                item.label.toLowerCase().includes(searchTerm.toLowerCase()) && isDateMatch // Tìm kiếm theo label
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
                    Tìm kiếm theo id cửa
                </Button>
                <Button variant={searchMode === "member" ? "contained" : "outlined"} onClick={() => setSearchMode("member")}>
                    Tìm kiếm theo label
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
                label={searchMode === "door" ? "Id cửa" : "Label"}
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
                            <TableCell>ID cửa</TableCell> 
                            <TableCell>Label</TableCell>
                            <TableCell>Độ tương đồng với label</TableCell>
                            <TableCell>Thời gian</TableCell>
                            <TableCell>Lý do</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredHistory.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.door.id}</TableCell>
                                <TableCell>{item.label}</TableCell>
                                <TableCell>{item.similarity}</TableCell>
                                <TableCell>
                                    {
                                        // Sử dụng date-fns để định dạng thời gian
                                        format(new Date(item.time), 'dd/MM/yyyy HH:mm:ss')
                                    }
                                </TableCell>
                                <TableCell>{item.reason === "0" ? "Dấu vân tay không có quyền mở cửa này" : item.reason === "1" ? "Dấu vân tay chưa vượt được ngưỡng tối thiểu" : item.reason === "2" ? "Sai mật khẩu khi mở cửa bằng mật khẩu" : item.reason === "3" ? "Cửa chưa được thiết lập mật khẩu" : "Có lỗi bên server xác thực vân tay"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default HistoryManagement;
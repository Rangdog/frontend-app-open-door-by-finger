import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import { getDetailVerify } from "../components/api";

const DetailVerify = ({ historyId, onBack }) => { // Nhận prop onBack
    const [details, setDetails] = useState([]);

    useEffect(() => {
        const fetchDetails = async () => {
            const data = await getDetailVerify(historyId);
            setDetails(data);
        };

        fetchDetails();
    }, [historyId]);

    return (
        <div>
            <Button variant="contained" onClick={onBack}>Quay lại</Button> {/* Nút quay lại */}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>ID cửa</TableCell>
                            <TableCell>ID thành viên</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {details.map((detail) => (
                            <TableRow key={detail.id}>
                                <TableCell>{detail.id}</TableCell>
                                <TableCell>{detail.door_id}</TableCell>
                                <TableCell>{detail.member_id}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default DetailVerify;
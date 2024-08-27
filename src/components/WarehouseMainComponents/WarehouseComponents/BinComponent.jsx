import React, {useContext} from 'react';

import {useNavigate} from "react-router-dom";

import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import '../../../rendering/components/WarehouseComponent/TrashBin.css';
import {UserContext} from "../../../contexts/UserContext";
import {deleteWarehouse} from "../../../services/WarehousePageSetupService";

function Bin() {
    const {selectedWarehouse, token} = useContext(UserContext);
    const navigate = useNavigate();

    const handleDelete = () => {
        deleteWarehouse(selectedWarehouse, token)
            .then(() => {
                navigate('/home')
            })
    };

    return (
        <IconButton
            onClick={handleDelete}
            className="trash-can"
        >
            <DeleteIcon sx={{ color: 'white', fontSize: '28px' }} />
        </IconButton>
    );
}

export default Bin;
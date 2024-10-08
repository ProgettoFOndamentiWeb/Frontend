import React, {useState, useContext, useEffect} from 'react';
import {socket} from "../../../socket";

import {
    Card,
    CardContent,
    CardMedia,
    Typography,
} from "@mui/material";
import './ObjectCardComponent.css'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButton from "@mui/material/IconButton";
import WarningIcon from '@mui/icons-material/Warning';
import Tooltip from "@mui/material/Tooltip";

import {UserContext} from "../../../contexts/UserContext";

import {deleteThing, modifyQuantity} from "../../../services/WarehousePageSetupService";

import logo1 from "../../../images/HomeImages/WarehouseCardImages/hammer.jpg";
import logo2 from "../../../images/HomeImages/WarehouseCardImages/screw.jpg";
import logo3 from "../../../images/HomeImages/WarehouseCardImages/brick.jpg";
import logo4 from "../../../images/HomeImages/WarehouseCardImages/saw.jpg";
import Cookies from "js-cookie";

const ObjectCard = ({thing}) => {

    const {selectedWarehouse, setSelectedWarehouse, account} = useContext(UserContext);
    const [inputValue, setInputValue] = useState(0);
    const {upgradeObjects, setUpgradeObjects} = useContext(UserContext)
    const [showTriangle, setShowTriangle] = useState(false);

    const handleDelete = async () => {
        try {
            const updatedThings = selectedWarehouse.lsThings.filter(item => item._id !== thing._id);

            setSelectedWarehouse({
                ...selectedWarehouse,
                lsThings: updatedThings,
            });

            const newWarehouse = await deleteThing(JSON.parse(sessionStorage.getItem("warehouse"))._id, thing._id, Cookies.get("sessionToken"), JSON.parse(Cookies.get("sessionUser")).sub);
            sessionStorage.setItem("warehouse", JSON.stringify(newWarehouse));

            socket.emit('deletedThing', {
                warehouseId: newWarehouse._id,
                newWarehouse,
            });

            setUpgradeObjects(upgradeObjects + 1);

        } catch (error) {
            console.error("Error deleting the thing: ", error);
        }
    };

    const handleInputChange = (event) => {
        setInputValue(Number(event.target.value));

    };
    const handleButtonClick = async () => {
        const warehouse = await modifyQuantity(thing._id, JSON.parse(sessionStorage.getItem("warehouse"))._id, inputValue, Cookies.get("sessionToken"), JSON.parse(Cookies.get("sessionUser")).sub);
        await sessionStorage.setItem("warehouse", JSON.stringify(warehouse));
        console.log(warehouse.ls)
        setInputValue(0);
        socket.emit('modifiedQuantity', {
            warehouseId: warehouse._id,
            warehouse,
        });
        setUpgradeObjects(upgradeObjects + 1);
    };

    useEffect(() => {
        if (thing.quantity <= thing.minQuantity) {
            setShowTriangle(true);
        }
        else
        {
            setShowTriangle(false);
        }
    });

    const getLogo = (selectedPic) => {
        console.log("Immagine ", selectedPic);
        switch(selectedPic) {
            case 1:
                return logo1;
            case 2:
                return logo2;
            case 3:
                return logo3;
            case 4:
                return logo4;
            default:
                return logo1;
        }
    };
    const logo = getLogo(thing.picture);

    return (
        <div>
        <Card className='objectCard'>

            <CardContent>
                <Box className="upperBox">
                    {showTriangle && selectedWarehouse.lsAdminsId.includes(account.sub) &&
                        <Tooltip title={`Materiale in esaurimento`} >
                            <WarningIcon className="alert" />
                        </Tooltip>
                        }

                    {selectedWarehouse.lsAdminsId.includes(account.sub) &&
                        <IconButton className="objectBin">
                            <DeleteIcon
                                onClick={handleDelete}
                            />
                        </IconButton>
                    }
                </Box>

                <div className='objectCardLogoContainer'>
                    <CardMedia className='objectCardLogo'
                               component="img"
                               height="250"
                               image={logo}
                               alt='chiodo'
                    />
                </div>
                <Typography gutterBottom variant="h5" className= 'objectName'>
                    {thing.name}
                </Typography>

                <div className='objectDataContainer'>
                    <div className= "objectQuantity">
                        <Typography variant="subtitle1" color="text.secondary" component='div' className='objectDescription'>
                            Quantità:
                        </Typography>
                        <Box className='objectQuantityContainer' variant='subtitle1' color='text.secondary'>
                            {thing.quantity}
                        </Box>
                    </div>
                    <div className='objectModifyQuantityContainer'>
                        <Box  className='objectChangeNumber'
                              component="form"
                              noValidate
                              autoComplete="off"
                        >
                            <div>
                                <TextField
                                    id="standard-number"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        style:{
                                            textAlign: 'center'
                                        },
                                    }}
                                    variant="standard"
                                />
                            </div>
                        </Box>

                        <Button
                            className="objectCardButton"
                            onClick={handleButtonClick}
                        >

                            <Typography
                                sx={{
                                    alignItems: 'center',
                                }}
                                className='objectContent'
                            >
                                <AddCircleOutlineIcon/>
                            </Typography>
                        </Button>
                    </div>

                </div>
            </CardContent>
        </Card>
        </div>

    );
}


export default ObjectCard;
import React, { useState, useContext } from 'react';

import { Card, CardContent, CardActions, Typography, TextField, Button, IconButton, Modal, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import IconChoose from "./IconChoose";

import SearchDinamically from "../../SearchDinamicallyComponent";

import { UserContext } from "../../../contexts/UserContext";

import './AddWarehouseCardComponent.css';


const libraries = ['places'];

const NewWarehouseIcon = ({ onCreate }) => {
    const [open, setOpen] = useState(false);
    const [warehouseName, setWarehouseName] = useState('');
    const [description, setDescription] = useState('');
    const [coordinates, setCoordinates] = useState([]);
    const [autocomplete, setAutocomplete] = useState(null);
    const { lsAdminsNickname, setLsAdminsNickname } = useContext(UserContext);
    const { lsUsersNickname, setLsUsersNickname } = useContext(UserContext);
    const { selectedImage, setSelectedImage } = useContext(UserContext);

    const handleOpen = () => setOpen(true);

    const handleClose = () =>
        setOpen(false);


    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyAFWH8opVo0QTRo7ChM-P0hCqvmd6cq8Tw",
        libraries: libraries,
    });

    const onLoad = (autocompleteInstance) => {
        setAutocomplete(autocompleteInstance);
    };

    const handlePlaceSelect = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place && place.geometry) {
                const locationCoordinates = [
                    place.geometry.location.lng(),
                    place.geometry.location.lat()
                ];
                setCoordinates(locationCoordinates);
                console.log("Coordinate selezionate: ", locationCoordinates);
            } else {
                console.log("Errore: place o place.geometry non definito");
            }
        }
    };

    const handleCreate = () => {
        if (onCreate && warehouseName && coordinates.length > 0) {
            onCreate({
                name: warehouseName,
                description: description,
                coordinates: coordinates,
                lsAdminsNickname: lsAdminsNickname,
                lsUsersNickname: lsUsersNickname,
                selectedImage: selectedImage
            });
            setWarehouseName('');
            setDescription('');
            setCoordinates([]);
            setSelectedImage(null);
            setLsAdminsNickname([]);
            setLsUsersNickname([]);
            console.log(lsAdminsNickname)
            console.log(lsUsersNickname)
            handleClose();
        } else {
            console.log("Errore: Informazioni incomplete");
        }
    };

    return (
        <div>
            <IconButton
                color="primary"
                aria-label="add warehouse"
                onClick={handleOpen}
                className="addWarehouseCard"
            >
                <AddCircleOutlineIcon
                    className="addWarehouseCardAddIcon"
                    style={{ fontSize: 130 }} />
            </IconButton>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="new-warehouse-modal-title"
                aria-describedby="new-warehouse-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="h2" gutterBottom>
                                Crea un Nuovo Magazzino
                            </Typography>
                            <TextField
                                fullWidth
                                label="Nome del Magazzino"
                                variant="outlined"
                                value={warehouseName}
                                onChange={(e) => setWarehouseName(e.target.value)}
                                sx={{ mt: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Descrizione"
                                variant="outlined"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                sx={{ mt: 2 }}
                            />
                            {isLoaded && (
                                <Autocomplete
                                    onLoad={onLoad}
                                    onPlaceChanged={handlePlaceSelect}
                                >
                                    <TextField
                                        fullWidth
                                        label="Posizione del Magazzino"
                                        variant="outlined"
                                        sx={{ mt: 2 }}
                                    />
                                </Autocomplete>
                            )}
                            <SearchDinamically scope="Amministratori" />
                            <SearchDinamically scope="Utenti" />
                            <IconChoose />
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCreate}
                            >
                                Crea
                            </Button>
                        </CardActions>
                    </Card>
                </Box>
            </Modal>
        </div>
    );
};

export default NewWarehouseIcon;

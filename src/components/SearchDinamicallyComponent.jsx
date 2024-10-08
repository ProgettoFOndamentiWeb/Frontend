import React, {useContext, useEffect, useState} from 'react';
import Cookies from "js-cookie";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import {searchUserByNickname} from '../services/HomePageSetupService';
import {addUser} from "../services/WarehousePageSetupService";

import {UserContext} from "../contexts/UserContext";

import './HomeMainComponents/AddWarehouseComponents/AddWarehouseCardComponent.css'
import {socket} from "../socket";


const SearchDinamically = ({scope}) => {
    const scopeToSend = `Seleziona ${scope}`
    const {token, sub, newNickname, setNewNickname} = useContext(UserContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [nicknameArray, setNicknameArray] = useState([]);
    const {lsAdminsNickname, setLsAdminsNickname} = useContext(UserContext);
    const {lsUsersNickname, setLsUsersNickname} = useContext(UserContext);
    const {list, upgradedUserList, setUpgradedUserList} = useContext(UserContext);
    const {selectedWarehouse, setSelectedWarehouse} = useContext(UserContext)

    useEffect(() => {
        if (searchQuery.trim() !== '') {
            searchUserByNickname(searchQuery, token, sub)
                .then((nicknames) => {
                    const filteredNicknames = nicknames.filter((nickname) => {
                        if (scope === "Amministratori" || scope === "Utenti") {
                            return !lsAdminsNickname.includes(nickname) && !lsUsersNickname.includes(nickname);
                        } else {
                            return !list.includes(nickname);
                        }
                    });
                    setNicknameArray(filteredNicknames || []);
                })
                .catch((error) => {
                    console.error('Error fetching nicknames:', error);
                    setNicknameArray([]);
                });
        } else {
            setNicknameArray([]);
        }
    }, [searchQuery])


    const handleAdd = async () => {
        if (newNickname.trim()) {
            if(scope==="Amministratori")
            {setLsAdminsNickname([...lsAdminsNickname, newNickname]);
                setNewNickname('');
                console.log('Admins List:', lsAdminsNickname)
            }
            else if(scope==="Utenti")
            {
                setLsUsersNickname([...lsUsersNickname, newNickname]);
                setNewNickname('');
                console.log('Users List:', lsUsersNickname);
            }
            else if(scope==="Utente")
            {
                const warehouse = await addUser(newNickname, JSON.parse(sessionStorage.getItem("warehouse"))._id, token, JSON.parse(Cookies.get('sessionUser')).sub)
                await sessionStorage.setItem("warehouse", JSON.stringify(warehouse));
                setSelectedWarehouse(warehouse);
                setUpgradedUserList(upgradedUserList+1)
                socket.emit('addUser', {
                    warehouseId: warehouse._id,
                    warehouse,
                });
            }

        }
    };

    return (
        <div>
            <Autocomplete
                id="free-solo-demo"
                freeSolo
                sx={{ width: '100%' }}
                options={nicknameArray}
                onInputChange={(event, newInputValue) => {
                    setSearchQuery(newInputValue);
                    setNewNickname(newInputValue);
                }}
                clearText="Aggiungi"
                clearIcon={<AddCircleOutlineIcon
                    //color="primary"
                    style={{ fontSize: 40 }}
                    onClick={handleAdd}
                />}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={scopeToSend}
                        value={newNickname}
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',

                        }}

                        sx={{ mt: 2 }}
                    />
                )}
            />
        </div>
    );
}

export default SearchDinamically;
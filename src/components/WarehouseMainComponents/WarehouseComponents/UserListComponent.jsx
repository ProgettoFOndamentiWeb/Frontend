import React, {useContext, useEffect, useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

import './UserListComponent.css'

import {getUsers} from "../../../services/WarehousePageSetupService";

import {UserContext} from "../../../contexts/UserContext";

function UserList({type, list, control}) {
    const {token, account} = useContext(UserContext);
    const [usersList, setUsersList] = useState([]);

    console.log(account)
    useEffect(() => {
        getUsers(list, token)
            .then((response) => {
                setUsersList(response);
            })
    }, [list]);

    return (
        <List className="usersList" sx={{bgcolor: 'background.paper' }}>
            {usersList && usersList.map((user) => {
                return (
                    <ListItem
                        key={user.sub}
                    >
                        <ListItemAvatar>
                            <Avatar
                                alt={`Avatar`}
                                src={user.picture}
                            />
                        </ListItemAvatar>
                        <ListItemText primary={user.nickname} />
                        {type === 1 && account.sub === list[0] && user.sub !== list[0] &&
                            <Tooltip title="Rimuovi" placement="left">
                                <IconButton aria-label="delete admin">
                                    <PersonRemoveIcon />
                                </IconButton>
                            </Tooltip>
                        }
                        {type === 2 && account.sub === control[0] &&
                            <Tooltip title="Rimuovi" placement="left">
                                <IconButton aria-label="delete admin">
                                    <PersonRemoveIcon />
                                </IconButton>
                            </Tooltip>
                        }
                        {type === 1 && account.sub === list[0] && user.sub !== list[0] &&
                            <Tooltip title="Declassa" placement="right">
                                <IconButton aria-label="delete admin">
                                    <VisibilityOffIcon />
                                </IconButton>
                            </Tooltip>
                        }
                        {type === 2 && account.sub === control[0] &&
                            <Tooltip title="Rimuovi" placement="left">
                                <IconButton aria-label="delete admin">
                                    <VisibilityIcon />
                                </IconButton>
                            </Tooltip>
                        }
                    </ListItem>
                );
            })}
        </List>
    );
}

export default UserList;
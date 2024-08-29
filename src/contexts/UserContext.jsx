import React, {createContext, useContext, useState} from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [account, setAccount] = useState({});
    const [token, setToken] = useState("");
    const [sub, setSub] = useState("");
    const [warehouses, setWarehouses] = useState([]);
    const [newNickname, setNewNickname] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const [lsAdminsNickname, setLsAdminsNickname] = useState([]);
    const [lsUsersNickname, setLsUsersNickname] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [upgradedList, setUpgradedList] = useState(0);

    return (
        <UserContext.Provider value={{
            account, setAccount,
            token, setToken,
            sub, setSub,
            warehouses, setWarehouses,
            newNickname, setNewNickname,
            selectedImage, setSelectedImage,
            lsAdminsNickname, setLsAdminsNickname,
            lsUsersNickname, setLsUsersNickname,
            selectedWarehouse, setSelectedWarehouse,
            upgradedList, setUpgradedList

        }}>
            {children}
        </UserContext.Provider>
    );
};
import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from "../../contexts/UserContext";

import {getWarehousesId, getWarehouse, addWarehouse} from "../../services/HomePageSetupService";

import './HomeMainComponent.css';

import AddWarehouseCard from "./AddWarehouseComponents/AddWarehouseCardComponent";
import WarehouseCard from "./WarehouseCardComponent";
import Loading from "../../pages/LoadingPage";

const HomeMain = () => {
    const {sub, token, setWarehouses, warehouses, account} = useContext(UserContext);
    const [ready, setReady] = useState(false);

    const handleCreateWarehouse = async (newWarehouse) => {
        const addedWarehouse = await addWarehouse(account, newWarehouse, token);
        setWarehouses((prevWarehouses) => [...prevWarehouses, addedWarehouse]);
    };

    useEffect(() => {
        if (token) {
            setWarehouses([]); //Reset the list
            getWarehousesId(sub, token)
                .then((list) => {
                    const warehousePromises = list.map((element) => {
                        return getWarehouse(element, token);
                    });
                    Promise.all(warehousePromises)
                        .then((warehouses) => {
                            setWarehouses(warehouses);
                        })
                    setReady(true)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [token]);


    return (
        <main className="homeMain">
            <h1 className="homeMainTitle">I miei magazzini</h1>

            <div className="homeMainWarehouses">
                {ready ? (
                    warehouses.map((warehouse, index) => (
                        <WarehouseCard
                            warehouse={warehouse}
                            key={index}
                        />
                    ))
                ) : (
                    <Loading />
                )}
                <AddWarehouseCard onCreate={handleCreateWarehouse}/>
            </div>
        </main>
    );

}

export default HomeMain;
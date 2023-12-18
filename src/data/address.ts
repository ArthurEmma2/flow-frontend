// import {useContext} from "react";
import Address from "../types/address";
import Pagination from "../types/pagination";
import {MaybeHexString} from "aptos";
import netConfApt from "../config/configuration.aptos";
// import { MsgSigned } from "../context/msgSigned";


export const AddAddress = (creator: MaybeHexString, name: string, addr: string, chain: string, network: string) => {
    let myHeaders = new Headers();
    // const {msgSigned} = useContext(MsgSigned);
    console.log("address__",network)
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("authorization", msgSigned);
    let raw = JSON.stringify({
        "creator": creator,
        "name": name,
        "address": addr,
        "chain": chain,
        "network": network,
    });

    let requestOptions: RequestInit = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };
    console.log('netConfApt___', netConfApt.backend);
    return fetch(`${netConfApt.backend}/address/add`, requestOptions)
}

export const UpdateAddress = (creator: MaybeHexString, name: string, addr: string, chain: string, network: string, obj: Address) => {
    let myHeaders = new Headers();
    // const {msgSigned} = useContext(MsgSigned);
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("authorization", msgSigned);
    let raw = JSON.stringify({
        "creator": creator,
        "name": name,
        "address": addr,
        "chain": chain,
        "network": network,
    });

    let requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };
    return fetch(`${netConfApt.backend}/address/${obj.id}`, requestOptions)
}

export const DeleteAddress = (addressId: string) => {
    let myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("authorization", global.msgSigned);

    let requestOptions: RequestInit = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };
    return fetch(`${netConfApt.backend}/address/${addressId}`, requestOptions)
}

export const FindAddress = (creator: MaybeHexString, chain: string, network: string, {page, pageSize}: Pagination): Promise<Response> => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    return fetch(`${netConfApt.backend}/addresses?pagesize=${pageSize}&page=${page}&creator=${creator}&network=${network}&chain=${chain}`, requestOptions)
}

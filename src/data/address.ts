import Address from "../types/address";
import Pagination from "../types/pagination";


export const AddAddress = (creator: string, name: string, addr: string, chain: string, network: string) => {
    let myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");
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
    return fetch("https://api.moveflow.xyz/api/address/add", requestOptions)
}

export const UpdateAddress = (creator: string, name: string, addr: string, chain: string, network: string, obj: Address) => {
    let myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");
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
    return fetch(`https://api.moveflow.xyz/api/address/${obj.id}`, requestOptions)
}

export const DeleteAddress = (addressId: string) => {
    let myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");

    let requestOptions: RequestInit = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };
    return fetch(`https://api.moveflow.xyz/api/address/${addressId}`, requestOptions)
}

export const FindAddress = (creator: string, chain: string, network: string, {page, pageSize}: Pagination): Promise<Response> => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    return fetch(`https://api.moveflow.xyz/api/addresses?pagesize=${pageSize}&page=${page}&creator=${creator}&network=${network}&chain=${chain}`, requestOptions)
}
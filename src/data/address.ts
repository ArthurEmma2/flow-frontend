


export const add = (creator: string, name: string, addr: string, chain: string, network: string) => {
    let myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify({
        "creator": creator,
        "name": name,
        "address": addr,
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

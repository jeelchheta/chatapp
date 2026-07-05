import APIJSON from "../api.json";

export function GetData(url, authToke) {
    const options = {
        method: 'GET', // Specify the GET method
        headers: {
            'Content-Type': 'application/json', // Indicate that the body is JSON
            'authorization': "Bearer " + authToke
        }
    };
    return new Promise((resolve, reject) => {
        fetch(`${APIJSON.BASEURL}${url}`, options).
            then(res => {
                return res.json()
            }).
            then(res => resolve(res)).catch(err => resolve({}))
    })
}

export function PostData(url, authToke, postData) {
    const options = {
        method: 'POST', // Specify the POST method
        headers: {
            'Content-Type': 'application/json', // Indicate that the body is JSON
            'authorization': "Bearer " + authToke
        },
        body: JSON.stringify(postData) // Convert the JavaScript object to a JSON string
    };
    return new Promise((resolve, reject) => {
        fetch(`${APIJSON.BASEURL}${url}`, options).
            then(res => {
                return res.json()
            }).
            then(res => resolve(res)).catch(err => resolve({}))
    })
}

export function PutData(url, authToke, postData) {
    const options = {
        method: 'PUT', // Specify the PUT method
        headers: {
            'Content-Type': 'application/json', // Indicate that the body is JSON
            'authorization': "Bearer " + authToke
        },
        body: JSON.stringify(postData) // Convert the JavaScript object to a JSON string
    };
    return new Promise((resolve, reject) => {
        fetch(`${APIJSON.BASEURL}${url}`, options).
            then(res => {
                return res.json()
            }).
            then(res => resolve(res)).catch(err => resolve({}))
    })
}


export function DeleteData(url, authToke, postData) {
    const options = {
        method: 'DELETE', // Specify the DELETE method
        headers: {
            'Content-Type': 'application/json', // Indicate that the body is JSON
            'authorization': "Bearer " + authToke
        },
        body: JSON.stringify(postData) // Convert the JavaScript object to a JSON string
    };
    return new Promise((resolve, reject) => {
        fetch(`${APIJSON.BASEURL}${url}`, options).
            then(res => {
                return res.json()
            }).
            then(res => resolve(res)).catch(err => resolve({}))
    })
}
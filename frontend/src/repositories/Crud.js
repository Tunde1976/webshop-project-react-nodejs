import { API_URL } from "./constants";

function create(data, path) {
    return fetch(`${API_URL}${path}`, {
        credentials: "include",
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
}

function read (path) {
    return fetch (`${API_URL}${path}`, {credentials: 'include'})
}


function update (data, path) {
    return fetch (`${API_URL}${path}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
    });
}

function partialUpdate (data, path) {
    return fetch (`${API_URL}${path}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
    });
}

function  remove(path) {
    return fetch (`${API_URL}${path}`, {
        method: 'DELETE' ,
        credentials: 'include'
    })
}

function upload (data, path) {
    return fetch (`${API_URL}${path}`, {
        method: 'POST',
        body: (data),
    });
}

export {
    create,
    read,
    update,
    partialUpdate,
    remove,
    upload
};
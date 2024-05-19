const apiBaseUrl = 'http://localhost:8000';

const START_SIGNAL_URL = "/api/diagnostic/start";
const STOP_SIGNAL_URL =  "/api/diagnostic/stop";

function apiPostData(url, data) {
    console.log("post data")
    fetch(apiBaseUrl + url, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(data) 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); 
    })
    .then(data => {
        console.log('Success:', data); 
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error); 
    });
}

function apiGetData(url){
    fetch(url)
    .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
    })
    .then(data => {
    console.log(data);
    })
    .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
    });
}

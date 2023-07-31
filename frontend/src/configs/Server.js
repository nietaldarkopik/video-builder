const Server = {
    baseUrlServer: 'http://localhost:4000/'
}
let getData = false;
let postData = false;

export const fetchDataGet = async () => {
    await fetch(Server.baseUrlServer + 'youtube')
        .then((response) => response.json())
        .then((data) => { getData = data; })
        .catch((error) => console.error('Error fetching data:', error));
};

export const fetchDataPost = async (dataPost, url) => {
    let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'value' }), // Replace with your POST data
    };
    Object.assign(requestOptions, dataPost);
    console.log('requestOptions', requestOptions);
    const out = await fetch(Server.baseUrlServer + url, requestOptions)
        .then((response) => {
            const responsejson = response.json();
            return responsejson;
        })
        .then((data) => {
            postData = data;
            console.log('postData', postData);
            return postData
        })
        .catch((error) => console.error('Error fetching data:', error));
    //console.log('out',out);
    return out;
};


export const GetData = async () => {
    return getData;
}

export const PostData = async () => {
    return postData;
}

export default Server;

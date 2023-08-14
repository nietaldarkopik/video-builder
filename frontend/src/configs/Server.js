const Server = {
    baseUrlServer: 'http://localhost:4000/'
}
let getData = false;
let postData = false;

export const fetchDataGet = async (url) => {
    return await fetch(Server.baseUrlServer + url)
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
            if (response.status === 302) {
                const redirectUrl = response.headers.get('Location');
                if (redirectUrl) {
                    return fetch(redirectUrl);
                } else {
                    throw new Error('Redirect location not found.');
                }
            } else if (!response.ok) {
                throw new Error(`Failed to download the file. Status Code: ${response.status}`);
            }
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

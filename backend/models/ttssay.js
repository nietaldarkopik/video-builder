//const wsUrl = 'wss://s-api.prosa.ai/v2/speech/stt';
//const WebSocket = require('ws');
const fs = require('fs');
const https = require('https');

// Setup
const apiKey = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ik5XSTBNemRsTXprdE5tSmtNaTAwTTJZMkxXSTNaamN0T1dVMU5URmxObVF4Wm1KaSIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbl9pZCI6MjIxNzQ2LCJsaWNlbnNlX2tleSI6Ijg4YjNmYWM0LWUxNmQtNGYwZC05MDE2LWQ0NGRmNTI2NWI0NiIsInVuaXF1ZV9rZXkiOiJkZGU1ZTg0OS1jOTIzLTQ4ODctYjViMy04M2JiZmYyZThkOTYiLCJwcm9kdWN0X2lkIjozLCJhdWQiOiJhcGktc2VydmljZSIsInN1YiI6IjZhYmJlMTVjLTRkZjEtNDg2Ny04MGE2LTQ2NmJlMzFlMWJhMyIsImlzcyI6ImNvbnNvbGUiLCJpYXQiOjE2OTA4MDc0OTN9.b_9aNpfIPS00SteDThRIq0bPFmmFVeA0W8C2d9w68uUIAkng-f89MauCoTocwtZzx-5sC9hl5Tc710ueYd9utKM4nguWEjW_UcT0Pn29bLr8gv5Ktgrl_KHjc5Z-vDxxrEOjnonBQfLsk8S-8V5FLK00eBgBa1Z00tNIa_Nsw881bC1YyKlSX7UQsUcjxT455qYbd0FsM7wDCu4vpXxpJxoHGydP4RspNx5T9yrA9LtMVRCK6mTDctmCnzCwKEFn-4hw33kb3Zonui6A15RUFRnj-25KvklYl7xL97VUWmo6BUlTEByIYDZiMYtTLunbm0MkF1DRt0RDza_Hw7MMgg';
const apiUrl = 'https://api.prosa.ai/v2/speech/tts';
const url = apiUrl;

(async () => {
    const filename = 'generated_audio.webm';
    const text = "Hasil akhir dari pekerjaan ini cukup memuaskan";

    let res = await submitTtsRequest(text, "mp3");

    const jobId = res["job_id"];

    const pollInterval = 5.0 * 1000;

    let result = null;

    while (true) {
        result = await queryTtsResult(jobId);

        if (result != null) {
            break;
        }

        await new Promise((resolve) => {
            setTimeout(resolve, pollInterval);
        });
    }

    fs.writeFileSync(filename, result);

})();


async function submitTtsRequest(text, audio_format) {
    const payload = {
        "config": {
            "model": "tts-dimas-formal",
            "wait": false,  // Do not wait for the request to complete
            "audio_format": audio_format
        },
        "request": {
            "text": text
        }
    }

    return await request(url, "POST", {
        json: payload,
        headers: {
            "x-api-key": apiKey
        }
    });
}

async function queryTtsResult(jobId) {
    let res = await request(url + "/" + jobId, "GET", {
        headers: {
            "x-api-key": apiKey
        }
    });
    if (res["status"] === "complete") {
        let base64AudioData = res["result"]["data"];
        return Buffer.from(base64AudioData, 'base64');
    }

    return null;
}

function request(url, method, { headers = null, json = null }) {
    return new Promise((resolve, reject) => {
        let req = https.request(url, {
            method: method,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json; charset=UTF-8",
                ...headers
            }
        }, (res) => {
            if (res.statusCode === 200) {
                let data = ""
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    const response = JSON.parse(data);
                    resolve(response);
                });
            } else {
                reject(res.statusCode);
            }
        })

        req.on('error', reject);

        if (json != null) {
            req.write(JSON.stringify(json));
        }
        req.end();
    })
}


/* 
(async () => {
    // Setup
    const url = 'wss://s-api.prosa.ai/v2/speech/stt';
    const apiKey = apiKeyProsa;
    const filename = 'audio_file.mp3';

    let client = new WebSocket(url);

    // Wait for the client to connect using async/await
    await new Promise(resolve => client.once('open', resolve));

    // Authenticate via websocket message
    client.send(JSON.stringify({
        'token': apiKey
    }));

    // Configure the session
    client.send(JSON.stringify({
        'model': 'stt-general-online',
        'label': 'This is example streaming session'
    }));

    // Send audio data via websocket
    let stream = fs.createReadStream(filename);

    stream.on('readable', async () => {
        // Read file to send
        let chunk;
        while ((chunk = stream.read(16000))) {
            client.send(chunk, { binary: true })
        }
    });

    stream.on('close', () => {
        // Signifies the end of audio stream
        client.send(null, { binary: true })
    });

    // Receive results via websocket
    client.on('message', msg => {
        let data = JSON.parse(msg);

        const message_type = data["type"]

        if (message_type === "result") {
            const transcript = data["transcript"]
            // Process final transcript
        } else if (message_type === "partial") {
            const transcript = data["transcript"]
            // Process partial transcript
        }
    });
})();
 */
const ytdl = require('ytdl-core');
const fs = require('fs');
const http = require('http');
const https = require('https');

const downloadVideo = async (url, path, name) => {
    try {
        path = path || `../videos/master/`;
        const info = await ytdl.getInfo(url);
        console.log(info.formats);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });

        if (!format) {
            console.error('Could not find a suitable video format.');
            return;
        }

        const videoTitle = info.videoDetails.title.replace(/[/\\?%*:|"<>]/g, ''); // Remove invalid characters from the title
        const fileExtension = format.container || 'mp4';
        const outputFileName = `${path}${videoTitle}.${fileExtension}`;

        const videoStream = ytdl(url, { format });

        videoStream.on('error', (err) => {
            console.error('Error downloading video:', err);
        });

        videoStream.pipe(fs.createWriteStream(outputFileName)).on('finish', () => {
            console.log(`Video downloaded successfully: ${outputFileName}`);
        });
        return info;
    } catch (error) {
        console.error('Error fetching video information:', error);
    }
};

const downloadFile = async (url, path) => {

    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        let output = false;
        path = path || `../videos/master/`;
        const o = protocol.get(url, async (response) => {
            if (response.statusCode !== 200) {
                console.log({ message: `Failed to download the file. Status Code: ${response.statusCode}`, error: response });
                return { message: `Failed to download the file. Status Code: ${response.statusCode}`, error: response };
            }

            const totalSize = Number(response.headers['content-length']);
            let downloadedSize = 0;

            const fileStream = await fs.createWriteStream(path);
            //console.log(fileStream);

            await response.pipe(fileStream);
            await fileStream.on('finish', () => {
                fileStream.close();
                output = { message: 'Success', error: null };
                console.log(output);
                return output;
            });


            response.on('data', (chunk) => {
                downloadedSize += chunk.length;
                const progress = (downloadedSize / totalSize) * 100;
                console.log(`Progress: ${progress.toFixed(2)}%`);
            });

            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                //resolve(data);
                resolve({message: 'Success', error: null, path : path});
            });

            response.on('error', (error) => {
                reject(error);
            });
            return output;
        }).on('error', (error) => {
            output = { message: 'Error', error: error };
            console.log(output);
            return output;
        });
        return output

    })
};

const infoVideo = async (url) => {
    try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });

        if (!format) {
            console.error('Could not find a suitable video format.');
            return;
        }
        return info;
    } catch (error) {
        console.error('Error fetching video information:', error);
    }
};

module.exports = {
    downloadVideo,
    downloadFile,
    infoVideo
};
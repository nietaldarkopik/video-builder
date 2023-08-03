const fs = require('fs');

exports.listFiles = async (path) => {

    return new Promise((resolve, reject) => {
        const directoryPath = path || './'; // Change this to the path of the directory you want to list files from
        const files = fs.readdir(directoryPath, (err, filenames) => err != null ? reject(err) : resolve(filenames));
        //console.log(files);
        return files;
    });
}

exports.readFile = async (path) => {

    try {
        const data = fs.readFileSync(path);
        return data;
    } catch (err) {
        console.error('Error reading the file:', err);
    }
}

exports.decode64 = (str) => {
    let decodedString = str;
    if (/^[A-Za-z0-9+/=]+$/.test(str)) {
        decodedString = atob(str);
    }
    console.log(decodedString);
    return decodedString;
}

exports.generateUniqueTimestamp = (tostring = true) => {
    const timestamp = Date.now();
    return (tostring)?timestamp.toString():timestamp;
}
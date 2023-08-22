const fs = require('fs');
const pathFs = require('path');

exports.listFiles = async (path) => {

    return new Promise((resolve, reject) => {
        const directoryPath = path || './'; // Change this to the path of the directory you want to list files from
        const files = fs.readdir(directoryPath, (err, filenames) => err != null ? reject(err) : resolve(filenames));
        //console.log(files);
        return files;
    });
}
exports.getFilesRecursively = async (dir, fileList = []) => {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = pathFs.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            exports.getFilesRecursively(filePath, fileList);
        } else {
            fileList.push(filePath);
        }
    });

    return fileList;
}
exports.readFile = async (path) => {

    try {
        fs.access(path, fs.constants.F_OK, (err) => {
            if (err) {
                path = this.decode64(path);
                const data = fs.readFileSync(path);
                return data;
            } else {
                const data = fs.readFileSync(path);
                return data;
            }
        });

    } catch (err) {
        console.error('Error reading the file:', err);
    }
}
exports.checkFilePath = async (path) => {

    try {
        fs.access(path, fs.constants.F_OK, (err) => {
            console.log(err)
            if (err) {
                console.log('err', err);
                console.log('path', path);
                path = this.front_decode64(path);
            }
        });
        console.log('ok',path)
        return path;
    } catch (err) {
        console.error('Error reading the file:', err);
    }
}

exports.decode64 = (str) => {
    let decodedString = str;
    if (str != '' && str != false && str != 'false' && /^[A-Za-z0-9+/=]+$/.test(str)) {
        decodedString = (!atob(str)) ? str : atob(str);
    }
    console.log(decodedString);
    return decodedString;
}

exports.generateUniqueTimestamp = (tostring = true) => {
    const timestamp = Date.now();
    return (tostring) ? timestamp.toString() : timestamp;
}

exports.wait = (seconds) => {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}


exports.front_decode64 = (str) => {
    let decodedString = str;
    if (str && /^[A-Za-z0-9+/=]+$/.test(str)) {
        decodedString = (!atob(str)) ? str : atob(str);
    }
    return decodedString;
}

exports.front_encode64 = (str) => {
    let decodedString = str;
    if (/^[A-Za-z0-9+/=]+$/.test(str)) { } else {
        decodedString = btoa(str);
    }
    return decodedString;
}
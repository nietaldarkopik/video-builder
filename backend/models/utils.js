const fs = require('fs');

exports.listFiles = async (path) => {

    return new Promise((resolve, reject) => {
        const directoryPath = path || './'; // Change this to the path of the directory you want to list files from
        const files = fs.readdir(directoryPath,(err, filenames) => err != null ? reject(err) : resolve(filenames));
        //console.log(files);
        return files;
    });
}
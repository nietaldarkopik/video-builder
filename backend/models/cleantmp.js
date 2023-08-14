const fs = require('fs');
const path = require('path');

// Buat fungsi untuk menghapus semua file dalam direktori
async function removeFilesInDirectory(directory) {
    return new Promise(async (resolve, reject) => {
        await fs.readdir(directory, async (err, files) => {
            if (err) {
                console.error('Terjadi kesalahan saat membaca direktori:', err);
                return;
            }

            await files.forEach(async (file) => {
                const filePath = path.join(directory, file);

                await fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Terjadi kesalahan saat menghapus file:', err);
                        reject(new Error(`Child process exited with code ${err}`));
                    } else {
                        console.log('File berhasil dihapus:', filePath);
                        resolve();
                    }
                });
            });
            resolve();
        });
    });
}

// Panggil fungsi untuk menghapus semua file dalam direktori
//removeFilesInDirectory(directoryPath);


module.exports = {
    removeFilesInDirectory
};
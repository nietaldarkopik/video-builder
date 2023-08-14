const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const fluentffmpeg = require('fluent-ffmpeg');
const ffprobePath = require('ffprobe-static');
const ffmpeg = require('ffmpeg-static');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
let tmpfiles = "../videos/chunks/tmp.txt";
let outputVideoTmpPath = '../videos/chunks/'; // Ganti dengan path dan nama file video keluaran
let outputVideoEnd = '../videos/output/'; // Ganti dengan path dan nama file video keluaran
let directoryPath = '../videos/chunks/'; // Ganti dengan path direktori yang berisi file yang ingin Anda hapus
const currentDirname = __dirname;


async function buildVideo(chunks) {
    await fluentffmpeg.setFfmpegPath(ffmpegPath);
    await fluentffmpeg.setFfprobePath(ffprobePath.path);

    let split_times = []
    await console.log('Start process remove files temporary')

    await removeFilesInDirectory(outputVideoTmpPath).then(async () => {
        await console.log('End process remove files temporary')
        const promises = chunks.map(async (v, i) => {
            const inputVideoPath = v.video_url;

            let filenameEnd = inputVideoPath.split('/');
            filenameEnd = filenameEnd[filenameEnd.length - 1];
            let fileExt = filenameEnd.split('.');
            fileExt = '.' + fileExt[fileExt.length - 1];
            //console.log(fileExt);

            //fluentffmpeg.setFfmpegPath(ffmpeg.path);
            const chunk = [v.start_time, v.end_time, v.video_url, fileExt, v.ismirror, v.description];
            const split_time = chunk; // Waktu mulai bagi video (format: HH:mm:ss)
            const chunkname = 'chunk-' + i;
            v.chunkname = chunkname
            v.fileExt = fileExt
            split_times.push(v);
            await console.log('start process splitting', split_time);
            const c = await splitVideo(split_time, i).then((result) => {
                console.log('end process splitting', split_time);
            }).catch((err) => {
                console.log('error process splitting', err);
            });
            return c;
        })
        await Promise.all(promises)


        console.log('wait 5 seconds');
        utils.wait(5)
        console.log('start process merge', split_times);
        await mergeVideo(split_times, utils.generateUniqueTimestamp() + '.mp4')
        console.log('end process merge', split_times);
    })
}

// Buat fungsi untuk menghapus semua file dalam direktori
async function removeFilesInDirectory(directory) {
    return new Promise(async (resolve, reject) => {
        await fs.readdir(directory, async (err, files) => {
            if (err) {
                console.error('Terjadi kesalahan saat membaca direktori:', err);
                return;
            }

            await files.map(async (file) => {
                const filePath = path.join(directory, file);

                await fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Terjadi kesalahan saat menghapus file:', err);
                        reject(new Error(`Child process exited with code ${err}`));
                    } else {
                        console.log('File berhasil dihapus:', filePath);
                        //resolve();
                    }
                });
            });
            resolve();
        });
    });
}

// Buat fungsi untuk membagi video
async function splitVideo(split_time, i) {
    try {
        return new Promise(async (resolve, reject) => {

            const v = split_time;
            let startTime = v[0];
            let duration = v[1];
            //let chunk = path.basename(v[2]);
            let chunk = v[2];
            let fileExt = v[3];
            let ismirror = v[4];
            //console.log(outputVideoTmpPath + chunk);
            /* let params = [
                '-i', chunk, //inputVideoPath + fileExt,
                '-ss', startTime,
                '-to', duration,
                '-c', 'copy',
                outputVideoTmpPath + 'chunk-' + i + fileExt
            ];

            if (ismirror) {
                params.push('-vf');
                params.push('hflip');
            }

            //console.log(params)
            const ffmpegProcess = await spawn(ffmpeg, params);
            await ffmpegProcess.on('close', (code, selector, data) => {
                if (code === 0) {
                    console.log('Video berhasil dibagi!');
                    resolve();
                } else {
                    //console.error('Terjadi kesalahan saat membagi video.');
                    console.log('Terjadi kesalahan saat membagi video.');
                    reject(new Error(`Child process exited with code ${code}`));
                }
            }); */


            const command = fluentffmpeg();
            command
                .addInput(chunk)
                .output(outputVideoTmpPath + 'chunk-' + i + fileExt)
                //.audioCodec('copy')
                //.videoCodec('copy')
                //.keepDAR()
                //.size(`1920x1080`)
                .size(`1280x720`)
                //.videoFilters(`scale=1920:1080`)
                //.videoBitrate('2000k')
                //.audioBitrate('128k')
                //.audioCodec('libmp3lame')
                .inputFps(30)
                .audioCodec('aac')
                //.videoCodec('mpeg4')
                .videoCodec('libx264')

                .addOption('-crf', '18') // Set Constant Rate Factor (CRF) for H.264
                .addOption('-b:a', '256k') // Set audio bitrate
                //.format('mp4') // -f segment -reset_timestamps  1')
                .on('start', function (commandLine) {
                    console.log('Spawned Ffmpeg with command: ' + ffmpegPath + commandLine);
                })
                .on('end', () => {
                    console.log('Concatenation successful!');
                    resolve();
                    //callback(null); // Call the callback with no error to indicate success
                })
                .on('error', (err) => {
                    console.error('Error during concatenation:', err.message);
                    reject(new Error(`Child process exited with code ${err.message}`));
                    //callback(err); // Call the callback with the error to indicate failure
                })
                .inputOptions(['-ss', startTime, '-to', duration]) //, '-f segment -reset_timestamps  1'])
                //.outputOptions('-c copy')
                .run();
        })
    } catch (e) {
        console.log('error', e)
    }
}

function addWatermark() {
    //ffmpeg -i input.mp4 -i watermark.png -filter_complex "overlay=10:10" output.mp4
}

function resizeVideo() {
    //ffmpeg -i input.mp4 -vf "scale=640:360" output.mp4
}

function convertVideoFormat() {
    //ffmpeg -i input.mp3 -codec:a libopus output.opus
}

async function mergeVideo_() {
    //ffmpeg -i "concat:input1.mp4|input2.mp4|input3.mp4" -c copy output.mp4

    return new Promise(async (resolve, reject) => {
        let concatString = [];
        split_time.forEach(v => {
            concatString.push(directoryPath + v[2] + fileExt);
        });
        concatString = concatString.join('"|"');
        const inputFiles = 'concat:"' + concatString + '"';
        /* let ffmpegProcess = fluentffmpeg();
        concatString.forEach(async (file) => {
            console.log(file);
            await ffmpegProcess.addInput(file);
        }); */
        //console.log(inputFiles);
        const ffmpegProcess = spawn(ffmpeg, [
            ' -i ', inputFiles,
            ' -c ', ' copy ',
            outputVideoEnd + filenameEnd
        ]);
        //console.log(ffmpegProcess.toString());
        //console.log(outputVideoEnd + filenameEnd);

        //const filterComplex = concatString.map((file, index) => `[${index}:v] [${index}:a]`).join(' ');

        ffmpegProcess
            /* .complexFilter([
                {
                    filter: 'concat',
                    options: {
                        n: concatString.length,
                        v: 1,
                        a: 1,
                    },
                    inputs: concatString.length,
                    outputs: ['merged_video', 'merged_audio'],
                },
            ]) */
            //.outputOptions('-map', '[v]', '-map', '[a]')
            //.mergeToFile(outputVideoEnd + filenameEnd)
            //.complexFilter(filterComplex, `[v] concat=n=${concatString.length}:v=1:a=1 [out]`)
            //.outputOption('-map', '[out]')
            //.output(outputVideoEnd + filenameEnd)
            .on('close', (code, selector, data) => {
                console.log(code, selector, data);
                if (code === 0) {
                    console.log('Video berhasil dimerge!');
                    resolve();
                } else {
                    //console.error('Terjadi kesalahan saat merge video.');
                    console.log('Terjadi kesalahan saat merge video.');
                    reject(new Error(`Child process exited with code ${code}`));
                }
            })
            .on('error', (err) => {
                console.error('Error during video merging:', err);
                reject('Error during video merging:' + err);
            })
            .on('end', () => {
                resolve();
                console.log('Video merging complete.');
            })
        //.run();
    });
}

async function mergeVideo(split_time, filenameEnd, callback) {
    try {

        let concatArr = [];
        let options = [];
        split_time.forEach((v, i) => {
            const fileExt = v.fileExt; //v[3]
            concatArr.push('file \'' + outputVideoTmpPath + v.chunkname + v.fileExt + '\'');
            options.push("[" + i + ":v:" + "0][" + i + ":a:" + "0]");
        });

        let concatString = concatArr.join("\n");
        //console.log(concatString);

        await fs.writeFile(tmpfiles, concatString, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('Data written ' + tmpfiles + ' to file successfully!');
                console.log(concatString)
                //const inputFiles = '"concat:' + concatString + '"';
                const inputFiles = tmpfiles;
                // Create a new ffmpeg command
                const command = fluentffmpeg();
                command.addInput(path.join(__dirname, '..\\', inputFiles));

                // Loop through the array of video paths and add them as inputs to the command
                //concatString.forEach((videoPath) => {
                //    command.addInput(videoPath);
                //});
                // Set the output file path and concatenate the videos
                /* if(ismirror)
                {
                    command.videoFilter('hflip')
                } */

                command
                    //.clone()
                    //.outputOptions('concat')
                    .output(outputVideoEnd + filenameEnd)
                    //.audioCodec('copy')
                    //.videoCodec('copy')
                    //.keepDAR()
                    //.videoBitrate('2000k')
                    //.audioBitrate('128k')
                    //.size(`1920x1080`)
                    .size(`1280x720`)
                    //.videoFilters(`scale=1920:1080`)
                    //.audioCodec('libmp3lame')
                    .inputFps(30)
                    .audioCodec('aac')
                    //.videoCodec('mpeg4')
                    .videoCodec('libx264')
                    .addOption('-crf', '18') // Set Constant Rate Factor (CRF) for H.264
                    .addOption('-b:a', '256k') // Set audio bitrate
                    //.format('mp4')
                    .on('start', function (commandLine) {
                        console.log('Spawned Ffmpeg with command: ' + ffmpegPath + commandLine);
                    })
                    .on('end', () => {
                        console.log('Concatenation successful!');
                        //callback(null); // Call the callback with no error to indicate success
                    })
                    .on('error', (err) => {
                        console.error('Error during concatenation:', err.message);
                        //callback(err); // Call the callback with the error to indicate failure
                    })
                    /*  .complexFilter([
                         {
                             filter: options+'concat=n='+concatArr.length+"v=1:a=1[outv][outa] -map \"[outv]\" -map \"[outa]\"",
                             options: {
                                 n: concatString.length,
                                 v: 1,
                                 a: 1,
                             },
                             inputs: concatString.length,
                             outputs: ['[outv][outa]'],
                         },
                     ]) */
                    .inputOptions(['-f', 'concat', '-safe', '0'])
                    //.outputOptions('-c copy')
                    //.outputOptions('-map','[outv]','-map','[outa]')
                    //.outputOptions('-filter_complex "[0:v:0][0:a:0]concat=n=1:v=1:a=1[outv][outa]" -map [outv] -map [outa]')
                    //.mergeToFile(outputVideoEnd + filenameEnd, './chunks/')
                    .run();
            }
        });

    } catch (err) {
        console.error('Error:', err.message);
        //callback(err); // Call the callback with the error to indicate failure
    }
}

// Panggil fungsi untuk membagi video
async function init() {
    try {

        console.log("Running Remove temp");
        await removeFilesInDirectory(directoryPath);
        console.log("Running Split Video");
        await splitVideo();
        console.log("Running merge Video");
        await mergeVideo();
        //await Promise.all([doremove, dosplitVideo, domergVideo]);
        console.log("Done");
    } catch (err) {
        console.error('Error running child process:', err);
    }
}


module.exports = {
    removeFilesInDirectory,
    buildVideo,
    mergeVideo,
}
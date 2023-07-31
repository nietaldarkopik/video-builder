import React, { useState } from 'react';
import ytdl from 'ytdl-core';
import { saveAs } from 'file-saver';

const ytdownloader = async (videoUrl) => {
    try {
        const info = await ytdl.getInfo(videoUrl);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
        const videoBlob = await ytdl(videoUrl, { format });
        saveAs(videoBlob, `${info.title}.${format.container}`);
    } catch (error) {
    }
};

export default ytdownloader;
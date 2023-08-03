import React, { useState, useRef, useEffect } from 'react';

const VideoPreview = React.forwardRef((props, ref) => {
    //const url = props.url;
    const time = props.time;
    const width = props.width;
    const height = props.height;
    const videoRef = ref;
    const [previewImage, setPreviewImage] = useState(null);

    console.log(time);
    useEffect(() => {
        const video = videoRef.current;
        console.log(video);

        const handleVideoLoad = () => {
            // Do something when the video is loaded and ready to play.
            console.log('Video is loaded and ready to play!');


            // Tangkap preview frame pada saat ini
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.crossOrigin = "anonymous";
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL();
            setPreviewImage(dataUrl);
            console.log(previewImage);
        };

        // Attach the "load" event listener to the video element.
        video.addEventListener('playing', handleVideoLoad);

        // Clean up the event listener when the component is unmounted.
        return () => {
            video.removeEventListener('playing', handleVideoLoad);
        };
    }, []); // The empty dependency array ensures that this effect runs only once when the component mounts.
    console.log(previewImage);
    return (
        <>
            {previewImage && <img src={previewImage} alt="Video Preview" />}
        </>
    );
});

export default VideoPreview;
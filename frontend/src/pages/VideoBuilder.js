import { Link, Outlet } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { useLocation } from 'react-router-dom';
import Server, { PostData, fetchDataGet, fetchDataPost } from '../configs/Server';
import { secondsToTime, parseXML } from '../helpers/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight, faPlayCircle, faPauseCircle, faTrashAlt, faArrowLeft, faArrowRight, faRecordVinyl } from '@fortawesome/free-solid-svg-icons';
import VideoPreview from '../helpers/videopreview'

//const { JSDOM } = require( "jsdom" );
//const { window } = new JSDOM( "" );
const jquery = require("jquery");
let globalPath = '';


const parseParams = (params = "") => {
  const rawParams = params.replace("?", "").split("&");
  const extractedParams = {};
  rawParams.forEach((item) => {
    item = item.split("=");
    extractedParams[item[0]] = item[1];
  });
  return extractedParams;
};

const decode64 = (str) => {
  let decodedString = str;
  if (/^[A-Za-z0-9+/=]+$/.test(str)) {
    decodedString = atob(str);
  }
  return decodedString;
}

const encode64 = (str) => {
  let decodedString = str;
  if (/^[A-Za-z0-9+/=]+$/.test(str)) { } else {
    decodedString = btoa(str);
  }
  return decodedString;
}
const VideoBuilder = () => {
  const location = useLocation();
  const btnChunkRef = useRef(null);
  let videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newChunk, setNewChunk] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(false);
  const [infoVideo, setInfoVideo] = useState(false);
  const [transcript, setTranscript] = useState(false);
  const [videoUrl, setVideoUrl] = useState(false);
  const [videoDRef, setVideoDRef] = useState(false);
  const [fileList, setFileList] = useState(false);
  let searchData = location.search || false;
  const stateData = location.state || false;
  searchData = (searchData) ? parseParams(searchData) : {};

  const [state, setState] = useState(stateData);
  const [path, setPath] = useState(stateData.path || searchData.path || false);
  const [videoFullUrl, setVideoFullUrl] = useState(Server.baseUrlServer + 'play-video?path=' + encode64(path));

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleGetTranscriptChunk = (start, end) => {
    let output = [];
    transcript.forEach((v, i) => {
      const attributes = v._attributes
      const text = v._text
      const tdur = attributes.dur;
      const tstart = attributes.start;
      const tend = (parseFloat(tstart) + parseFloat(tdur));
      //if(tstart <= parseFloat(start) && tend >= parseFloat(end))
      if (parseFloat(start) <= tstart && parseFloat(end) >= tstart) {
        return output.push(text);
      }
    })
    return output;
  }

  const handleOnPageReady = async () => {
    const p = decode64(path);
    const projectid = (p.match(/\/?([^/]+)$/)[1]).match(/([^\.]+)\.(.*)$/)[1];
    await fetchDataPost({ body: JSON.stringify({ projectid: projectid }) }, 'video/info').then((data) => { return data });
    const iVideo = await PostData().then((data) => {
      return data;
    });
    setInfoVideo((!iVideo.data) ? {} : JSON.parse(iVideo.data));

    await fetchDataPost({ body: JSON.stringify({ projectid: projectid }) }, 'video/transcript').then((data) => { return data });
    const tsVideo = await PostData().then((data) => {
      return data;
    });
    let tsObj = (!tsVideo.data) ? {} : JSON.parse(parseXML(tsVideo.data));
    tsObj = tsObj.transcript || {};
    tsObj = tsObj.text || {};
    setTranscript(tsObj || false);

    setVideoUrl(p)
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.load();
      videoRef.current.pause();
    } else {
      videoRef.current.load();
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleCreateChunk = () => {
    const start = (!newChunk.start) ? false : newChunk.start;
    const end = newChunk.end || false;

    if (isPlaying && !start) {
      videoRef.current.pause();
    }
    if (start !== false) {

      setIsPlaying(false);
      //setPreviewVideo(() => {return (<><VideoPreview time={start} width="200" height="100" ref={videoRef} url={Server.baseUrlServer + 'play-video?path=' + encode64(path)} /></>)})
      videoRef.current.pause();
      handleAddChunk({ start: start, end: currentTime })
      setNewChunk({ start: false });
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      setNewChunk({ start: currentTime + 0.01 });
      try {
        // Tangkap preview frame pada saat ini
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 150;
        canvas.crossOrigin = "*";

        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
        setPreviewVideo(dataUrl);
      } catch (e) {
        console.log("**NO** CORS permission for:", e);
      }
    }
  };

  const handleTimeChange = (props) => {
    const plus = props.plus || 0;
    const minus = props.minus || 0;

    console.log(plus, minus, videoRef.current.currentTime);
    if (plus) {
      videoRef.current.currentTime = currentTime + plus;
    }
    if (minus) {
      videoRef.current.currentTime = currentTime - minus;
    }
    //handleTimeUpdate();
  };

  const getFileList = async () => {
    const files = await fetchDataPost({ body: JSON.stringify({ path: '../videos/master/' }) }, 'file-list');
    const data = files.data || [];
    setFileList(data);
  }

  const TemplateChunkForm = (props) => {
    //const index = (!props.index) ? 0 : props.index;
    const start = (!props.start) ? 0 : props.start;
    const end = (!props.end) ? 0 : props.end;
    const index = 0;
    const trsc = handleGetTranscriptChunk(start, end);
    return (
      <div className="col-md-12 mt-3 chunk-item">
        <div className="row justify-content-start align-items-start g-2">
          <div className="col-md-3">
            {previewVideo && <img src={previewVideo} alt="Video Preview" crossOrigin="anonymous" width="100%" />}
          </div>
          <div className="col">
            <input type="text" name="videoUrl" value={globalPath} placeholder="Video URL" className="form-control" />
            <div className="input-group">
              <span className="input-group-text">Chunk Video</span>
              <input type="text" value={secondsToTime(start)} onChange={() => true} name="start_time{index}" aria-label="Start Time" placeholder="Start Time" className="form-control start_time" />
              <input type="text" value={secondsToTime(end)} onChange={() => true} name="end_time{index}" aria-label="End Time" placeholder="End Time" className="form-control end_time" />
              <div className="btn btn-group justify-content-center align-items-center" role="button" aria-label="Basic checkbox toggle button group">
                <input type="checkbox" className="btn-check" id={'input-mirror' + start + end} autoComplete="off" />
                <label className="btn btn-sm btn-outline-primary" for={'input-mirror' + start + end}>
                  Mirror?
                </label>
                <button type='button' className='btn btn-primary btn-sm btn-play-chunk' data-index={index}><FontAwesomeIcon icon={faPlayCircle} /> Play</button>
                <button type='button' className='btn btn-danger btn-sm btn-delete-chunk' data-index={index}><FontAwesomeIcon icon={faPlayCircle} /> Delete</button>
              </div>
            </div>
            <textarea name="description{index}" aria-label="Description" placeholder="Description" className="form-control description" onChange={() => true} value={trsc.join(' ')} />
          </div>
        </div>
        {/* <VideoPreview time={currentTime} width="200" height="100" ref={videoRef} url={Server.baseUrlServer + 'play-video?path=' + encode64(path)} /> */}
        {/* {previewVideo} */}
      </div>
    )
  }

  const handleAddChunk = async (props) => {
    const chunkContainer = document.querySelector('.chunk-container');
    const html = renderToStaticMarkup(<TemplateChunkForm index="0" {...props} />);
    jquery(chunkContainer).append('<div>' + html + '</div>');
  }

  const handleDeleteChunk = (e) => {
    jquery(e).closest(".chunk-item").parent().remove();
  }

  const handleChangeVideo = (uv) => {
    setPath(uv);
    setVideoUrl(uv);
    setVideoFullUrl(Server.baseUrlServer + 'play-video?path=' + encode64(uv));
    videoRef.current?.load();
    handleOnPageReady();
    globalPath = uv;
  }

  const VideoPlayer = ({ vref, vfullurl }) => {
    //setVideoDRef(vref);
    //setCurrentTime(0);
    //videoRef.current.currentTime = 0;

    return (
      <source src={videoFullUrl} />
    )
  }

  useEffect(() => {

    videoRef.current?.load();
    // After the component is mounted, attach the click event handler
    jquery(document).on("click", ".btn-delete-chunk", function (e) { handleDeleteChunk(this) })
    const videoRef_current = videoRef.current;
    videoRef.current.addEventListener('timeupdate', handleTimeUpdate)

    handleOnPageReady();
    getFileList()
    // Cleanup the event handler when the component is unmounted
    return () => {
      videoRef_current.removeEventListener('timeupdate', handleTimeUpdate)
      jquery(btnChunkRef.current).off('click', handleDeleteChunk);
    };

  }, []);

  return (

    <div className="row">
      <main className="col-md-12 ms-sm-auto col-lg-12 px-md-4">
        <div className='row'>
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Video Builder</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group me-2">
                <button type="button" className="btn btn-sm btn-outline-secondary">Profile</button>
                <button type="button" className="btn btn-sm btn-outline-secondary">Settings</button>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col'>
              {path &&
                <>
                  {path}
                  <div className="row justify-content-center align-items-center g-2 mt-3">
                    <div className="col-xl-8 col-lg-9 col-md-9 col-sm-12">
                      <div className="ratio ratio-16x9">
                        <video className="embed-responsive-item" ref={videoRef} controls crossOrigin='Anonimous'>
                          {videoFullUrl && <VideoPlayer/>}
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-3 col-md-3 col-sm-12 py-3 table-responsive" style={{ minHeight: '100%', height: "auto", maxHeight: 800 }}>
                      <ul className="list-group">
                        {fileList && Object.entries(fileList).map((v, i) => {
                          const u = '../videos/master/' + v[1] + '/thumbnail-' + v[1] + '-0.jpg'
                          const uv = '../videos/master/' + v[1] + '/' + v[1] + '.mp4';
                          return (
                            <>
                              <li className="list-group-item list-group-item-action" aria-current="true">
                                <div className="d-flex">
                                  <div className="d-flex align-self-start">
                                    <img src={Server.baseUrlServer + 'file/read?path=' + u} alt="" width="300" />
                                  </div>
                                  <div className="flex-grow-1 ms-3">
                                    <h5 className="mt-0">{v[1]}</h5>
                                    <button type="button" onClick={(e) => {handleChangeVideo(uv)}} className='btn btn-sm btn-primary'><FontAwesomeIcon icon={faPlayCircle} /></button>
                                  </div>
                                </div>
                              </li>
                            </>)
                        })}
                      </ul>
                    </div>
                  </div>
                  <div className="row justify-content-center align-items-center g-2 mt-3">
                    <div className="col">
                      <p>Current Duration: {currentTime.toFixed(2)} seconds</p>
                    </div>
                    <div className="col">
                      <p>Chunk Start: {secondsToTime(newChunk.start || 0)} </p>
                    </div>
                    <div className="col">
                      <p>Current Time: {secondsToTime(currentTime)} </p>
                    </div>
                  </div>
                  <div className="row justify-content-center align-items-center g-2 mt-3">
                    <div className="col">
                      <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-primary" onClick={() => handleTimeChange({ minus: 10 })}><FontAwesomeIcon icon={faAnglesLeft} /> 10 seconds</button>
                        <button type="button" className="btn btn-primary" onClick={() => handleTimeChange({ minus: 1 })}><FontAwesomeIcon icon={faAngleLeft} /> 1 seconds</button>
                        <button type="button" className="btn btn-info" onClick={handlePlayPause}>{isPlaying ? (<><FontAwesomeIcon icon={faPauseCircle} /> Pause</>) : (<><FontAwesomeIcon icon={faPlayCircle} /> Play</>)}</button>
                        <button type="button" className="btn btn-primary" onClick={() => handleTimeChange({ plus: 1 })}>1 seconds <FontAwesomeIcon icon={faAngleRight} /></button>
                        <button type="button" className="btn btn-primary" onClick={() => handleTimeChange({ plus: 10 })}>10 seconds <FontAwesomeIcon icon={faAnglesRight} /></button>
                      </div>
                      <button className="btn btn-warning ms-2" onClick={handleCreateChunk}><FontAwesomeIcon icon={faRecordVinyl} /> Record Chunk</button>
                    </div>
                  </div>
                </>
              }
              <div className="row justify-content-start align-items-start g-2">
                <div className="col-md-12 mt-3">
                  <h3>Split Video</h3>
                </div>
              </div>
              <div className="row justify-content-start align-items-start g-2 chunk-container"></div>
              <div className='row'>
                <div className="col-md-12 mt-3">
                  <div className="d-grid gap-2">
                    <button type="button" id="btn_add_chunk" onClick={handleAddChunk} className="btn btn-primary">
                      Add Chunk
                    </button>
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-start mt-5">
                <div className="flex-shrink-0">
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5 className="mt-0">Media heading</h5>
                  <p>This is some content from a media component. You can replace this with any content and adjust it as needed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Main content area --> */}
      </main>
    </div>
  );
};

export default VideoBuilder;

import { Link, Outlet } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { useLocation } from 'react-router-dom';
import Server from '../configs/Server';
import { secondsToTime } from '../helpers/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight, faPlayCircle, faPauseCircle, faTrashAlt, faArrowLeft, faArrowRight, faRecordVinyl } from '@fortawesome/free-solid-svg-icons';
//const { JSDOM } = require( "jsdom" );
//const { window } = new JSDOM( "" );
const jquery = require("jquery");


const parseParams = (params = "") => {
  const rawParams = params.replace("?", "").split("&");
  const extractedParams = {};
  rawParams.forEach((item) => {
    item = item.split("=");
    extractedParams[item[0]] = item[1];
  });
  return extractedParams;
};

const VideoBuilder = () => {
  const location = useLocation();
  const btnChunkRef = useRef(null);
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newChunk, setNewChunk] = useState(false);
  let searchData = location.search || false;
  const stateData = location.state || false;
  searchData = (searchData) ? parseParams(searchData) : {};

  const [state, setState] = useState(stateData);
  const [path, setPath] = useState(stateData.path || searchData.path || false);

  useEffect(() => {
    // After the component is mounted, attach the click event handler
    jquery(document).on("click", ".btn-delete-chunk", function (e) { handleDeleteChunk(this) })

    // Cleanup the event handler when the component is unmounted
    return () => {
      jquery(btnChunkRef.current).off('click', handleDeleteChunk);
    };
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleCreateChunk = () => {
    const start = newChunk.start || false;
    const end = newChunk.end || false;

    if (isPlaying && !start) {
      videoRef.current.pause();
    }

    if (start) {
      setIsPlaying(false);
      videoRef.current.pause();
      handleAddChunk({ start: start, end: currentTime })
      setNewChunk({ start: false });
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      setNewChunk({ start: currentTime });
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleTimeChange = (props) => {
    const plus = props.plus || 0;
    const minus = props.minus || 0;

    console.log(plus,minus,videoRef.current.currentTime);
    if(plus)
    {
      videoRef.current.currentTime = currentTime + plus;
    }
    if(minus)
    {
      videoRef.current.currentTime = currentTime - minus;
    }
    //handleTimeUpdate();
  };

  const TemplateChunkForm = (props) => {
    //const index = (!props.index) ? 0 : props.index;
    const start = (!props.start) ? 0 : props.start;
    const end = (!props.end) ? 0 : props.end;
    const index = 0;
    return (
      <div className="col-md-12 mt-3 chunk-item">
        <div className="input-group">
          <span className="input-group-text">Chunk Video</span>
          <input type="text" value={secondsToTime(start)} name="start_time{index}" aria-label="Start Time" placeholder="Start Time" className="form-control start_time" />
          <input type="text" value={secondsToTime(end)} name="end_time{index}" aria-label="End Time" placeholder="End Time" className="form-control end_time" />
          <textarea name="description{index}" aria-label="Description" placeholder="Description" className="form-control description" />
          <div className="btn btn-group justify-content-center align-items-center" role="button" aria-label="Basic checkbox toggle button group">
            <input type="checkbox" className="btn-check" id={'input-mirror' + start + end} autocomplete="off" />
            <label className="btn btn-sm btn-outline-primary" for={'input-mirror' + start + end}>
              Mirror?
            </label>
            <button type='button' className='btn btn-primary btn-sm btn-play-chunk' data-index={index}><FontAwesomeIcon icon={faPlayCircle} /> Play</button>
            <button type='button' className='btn btn-danger btn-sm btn-delete-chunk' data-index={index}><FontAwesomeIcon icon={faPlayCircle} /> Delete</button>
          </div>
        </div>
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
                  <div className="row justify-content-center align-items-center g-2 mt-3">
                    <div className="col-xl-8 col-lg-12 col-md-12 col-sm-12">
                      <div className="ratio ratio-16x9">
                        <video className="embed-responsive-item" ref={videoRef} controls onTimeUpdate={handleTimeUpdate}>
                          <source src={Server.baseUrlServer + 'play-video?path=' + path} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
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
                        <button type="button" className="btn btn-primary" onClick={() => handleTimeChange({minus: 10})}><FontAwesomeIcon icon={faAnglesLeft} /> 10 seconds</button>
                        <button type="button" className="btn btn-primary" onClick={() => handleTimeChange({minus: 1})}><FontAwesomeIcon icon={faAngleLeft} /> 1 seconds</button>
                        <button type="button" className="btn btn-info" onClick={handlePlayPause}>{isPlaying ? (<><FontAwesomeIcon icon={faPauseCircle} /> Pause</>) : (<><FontAwesomeIcon icon={faPlayCircle} /> Play</>)}</button>
                        <button type="button" className="btn btn-primary" onClick={() => handleTimeChange({plus: 1})}>1 seconds <FontAwesomeIcon icon={faAngleRight} /></button>
                        <button type="button" className="btn btn-primary" onClick={() => handleTimeChange({plus: 10})}>10 seconds <FontAwesomeIcon icon={faAnglesRight} /></button>
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

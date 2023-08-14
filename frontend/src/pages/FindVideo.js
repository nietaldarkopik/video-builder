import { Link, Outlet, useLocation } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import Server, { PostData, fetchDataPost } from '../configs/Server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingCircleXmark, faDownload } from '@fortawesome/free-solid-svg-icons';
import { encode64 } from '../helpers/utils';


const FindVideo = () => {
  const location = useLocation();
  const [listVideos, setListVideos] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [infoVideo, setInfoVideo] = useState(false);
  const refInputSearch = useRef()

  const handleInfo = async (urlVideo,videoId) => {
    const params = {
      body: JSON.stringify({ url: urlVideo })
    };
    const dataInfo = await fetchDataPost(params, 'youtube/info');
    /* const out = await PostData().then((response) => {
      return response;
    }); */
    const dataInfo_data = dataInfo?.data || false
    let oinfo = [];

    if(Array.isArray(infoVideo))
    {
      oinfo = infoVideo;
      oinfo[videoId] = dataInfo_data
    }else{
      oinfo[videoId] = dataInfo_data
    }
    setInfoVideo(oinfo)
    return dataInfo_data
  }

  const doSearch = async (page) => {
    const limit = 4; // Number of results per page
    const startIndex = (page - 1) * limit;
    const q = refInputSearch.current.value;
    const query = { query: q }
    const v = await fetchDataPost({ body: JSON.stringify(query) }, 'youtube/search')
    let dtvideos = v?.data?.videos
    dtvideos = dtvideos.slice(startIndex, startIndex + limit);
  
    setInfoVideo(false)
    setListVideos(dtvideos);
    return dtvideos
  }

  const handleSearch = () => {
    setIsLoading(true);
    const out = doSearch(1)
    setIsLoading(false);
    //setListVideos(out);
  }

  const OptionVideo = (props) => {
    const url = props.url || ''
    const videoid = props.videoid || ''
    let formats = [];
    if(typeof infoVideo[videoid] == 'undefined'){
      handleInfo(url,videoid);
      formats = infoVideo[videoid]?.formats;
    }else{
      formats = infoVideo[videoid]?.formats;
    }
    console.log('infoVideo', infoVideo[videoid]?.formats);
    return (
      <>
        {formats && 
          Object.values(formats).map((v) => {
            return (
              <option value={v.url}>
                {v.container} {v.quality} {v.qualityLabel} Audio: {v.hasAudio ? '1':'0'} Video: {v.hasVideo ? '1':'0'}
              </option>
            )
          })
        }
      </>
    )
  }

  const ListVideo =  (props) => {
    const videoId = props.videoId || ''
    const title = props.title || ''
    const ago = props.ago || ''
    const views = props.views || ''
    const description = props.description || ''
    const url = props.url || ''

    const author_url = props?.author?.url || ''
    const author_name = props?.author?.name || ''
    const duration_seconds = props?.duration?.seconds || ''
    const duration_timestamp = props?.duration?.timestamp || ''

    return (
      <div className="col">
        <div className="card">
          {/* <img src={props.thumbnail} className="card-img-top" alt="..." /> */}
          <div className="ratio ratio-16x9">
            <iframe width="560" height="315" src={'https://www.youtube.com/embed/' + videoId} frameborder="0" allowfullscreen></iframe>
          </div>
          <div className="card-body">
            <div className="row justify-content-start align-items-start gx-2">
              <div className="col-md-12">
                <a href={author_url} className="card-title">{author_name}</a>
                <h5 className="card-title"> {title}</h5>
                <span className="badge me-2 fs-6 bg-warning text-dark"><strong>Tanggal</strong>: {ago}</span>
                <span className="badge me-2 fs-6 bg-warning text-dark"><strong>Durasi</strong>: {duration_seconds} detik</span>
                <span className="badge me-2 fs-6 bg-warning text-dark"><strong>Menit</strong>: {duration_timestamp}</span>
                <span className="badge me-2 fs-6 bg-warning text-dark"><strong>View</strong>: {views} Views</span>
                <p className="card-text">{description}</p>
              </div>
              <div className="col-md-12">
                <a target='_blank' className='btn btn-primary w-100 my-3' href={`./video-downloader?path=` + encode64(url)}>
                  <FontAwesomeIcon icon={faBuildingCircleXmark}></FontAwesomeIcon> Force Download
                </a>
                {/* <a target='_blank' className='btn btn-primary' href={`./video-downloader?path=`+encode64(url)}><FontAwesomeIcon icon={faDownload}></FontAwesomeIcon> Force Download</a> */}
                <div className="input-group mb-3">
                  <select className="form-select" id="input-force-download" aria-label="Force Download">
                    <option selected>Choose...</option>
                    <OptionVideo url={url} videoid={videoId}/>
                  </select>
                  <button className="btn btn-primary" type="button">
                    <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon> Select Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isLoadingHtml = (isLoading !== false)?<div className="row row-cols-1 row-cols-md-2 g-4"><div classname="col">Loading ...</div></div>:<></>;
  return (
    <>
      <div className="container-fluid my-5">
        <div className='row'>
          <div className="container">
            <form action='#' onSubmit={handleSearch}>
              <div className="mb-3 row">
                <label htmlFor="inputName" className="col-4 col-form-label">
                  <strong>Keywords</strong>
                </label>
                <div className="col-8">
                  <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Keywords" ref={refInputSearch} />
                    <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>Search</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        {isLoadingHtml}
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {listVideos &&
            listVideos.map((v, i) => {
              return (<ListVideo {...v} key={i} />)
            })
          }
        </div>
      </div>
    </>
  );
};

export default FindVideo;

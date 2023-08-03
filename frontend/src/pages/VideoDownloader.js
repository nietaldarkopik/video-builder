import React, { useEffect, useState } from 'react';
import Server, {PostData, fetchDataGet,fetchDataPost,} from "../configs/Server";
import Console, {FormatVideo} from '../components/Console';
import Jsontreeview from '../helpers/treeview';

const jquery = require("jquery");

const VideoDownloader = () => {
  const [getData, setGetData] = useState(null);
  const [postData, setPostData] = useState(null);

  //console.log(Server);
  useEffect(() => {
    /* jquery("#btn-download-youtube").on("click", handleDownload(this));

    return () => {
      jquery(document).off("click", handleDownload);
    } */
  })


  const handleDownload = async (e) => {
    const urlVideo = jquery("#urlVideo").val();
    //console.log(urlVideo);
    //ytdownloader(urlVideo,'name');
    const params = {
      body: JSON.stringify({url: urlVideo})
    };
    await fetchDataPost(params,'youtube/download');
    await setPostData(PostData());
  }

  const handleInfo = async (e) => {
    const urlVideo = jquery("#urlVideo").val();
    //console.log(urlVideo);
    //ytdownloader(urlVideo,'name');
    const params = {
      body: JSON.stringify({url: urlVideo})
    };
    const dataInfo = await fetchDataPost(params,'youtube/info');
    const out = await PostData().then((response) => {
      return response;
    });
    await setPostData(out);
  }

  return (
    <div className="container">
      <div className="row">
        <main className="col px-md-4">
          <div className="row">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2">Video Downloader</h1>
            </div>
            <div className="row justify-content-start align-items-start g-2">
              <div className="col-md-12">
                <div className="mb-3">
                  <label for="" className="form-label">URL Video</label>
                  <textarea className="form-control" name="" id="urlVideo" rows="3"></textarea>
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <div className="d-grid gap-2">
                    {/* <button type="button" name="" id="btn-download-youtube" onClick={handleDownload} className="btn btn-primary">Download</button> */}
                    <button type="button" name="" id="btn-info-youtube" onClick={handleInfo} className="btn btn-primary">Get Info</button>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  {postData ? (
                    <div>
                      <FormatVideo data={postData.data} />
                      <h1>Data from POST API:</h1>
                      {/* <Console data={postData.data} /> */}
                      <Jsontreeview data={postData.data} />
                    </div>
                  ) : (
                    <p>Click the button above to make a POST request.</p>
                  )}
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  {getData ? (
                    <div>
                      <h1>Data from GET API:</h1>
                      <pre>{JSON.stringify(getData, null, 2)}</pre>
                    </div>
                  ) : (
                    <p>Click the button above to make a POST request.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Main content area --> */}
        </main>
      </div>
    </div>
  );
};

export default VideoDownloader;

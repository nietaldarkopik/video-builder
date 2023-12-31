import { Link, Outlet, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Server, { fetchDataPost } from '../configs/Server';
const basePathVideo = '../../videos/master/';

const VideoManager = () => {
  const [fileList, setFileList] = useState(false)
  const navigate = useNavigate();

  const getFileList = async (p = '../videos/master/') => {
    const vext = ['mp4', 'webm'];
    //const files = await fetchDataPost({ body: JSON.stringify({ path: p }) }, 'file-list');
    const files = await fetchDataPost({ body: JSON.stringify({ path: p }) }, 'file-recursive');
    let data = files.data || [];
    let output = [];

    console.log(data);
    if(Array.isArray(data) && data.length > 0)
    {
      output = data.filter((v,i) => {
        let check = v.split('/');
        check = check[check.length - 1];
        let cext = check.split('.');
        cext = cext[cext.length - 1];
        console.log(cext);
        if (vext.indexOf(cext) !== -1) {
          return true
        } else {
          return false;
        }
      })
    }
    setFileList(output);
  }

  useEffect(() => {
    if(fileList === false)
    {
      getFileList();
    }
  })

  const handleBuilder = (props) => {
    const path = props || false;
    if (path) {
      //const fullpath = btoa(basePathVideo + path);
      const fullpath = btoa(path);
      return navigate('/video-builder?path=' + fullpath, { state: props });
    } else {
      return false;
    }
  }

  const TrVideo = (props) => {
    const file = props.file || '';
    const no = props.no || 0;
    return (
      <>
        <tr className="table-primary" >
          <th scope="row" className="fw-bold">{no}</th>
          <td>{file}</td>
          <td>Item</td>
          <td>
            <div className="d-grid gap-2">
              <button type="button" className="btn btn-sm btn-outline-danger">Delete</button>
              <button type="button" className="btn btn-sm btn-outline-primary">Detail</button>
              <button type="button" className="btn btn-sm btn-outline-primary">Video</button>
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={(e) => { return handleBuilder(file) }}>Builder</button>
            </div>
          </td>
        </tr>
      </>
    )
  }
  return (
    <div className="container mt-5">
      <div className="row">
        {/* <!-- Main Content --> */}
        <main className="col-md-12 ms-sm-auto col-lg-12 px-md-4">
          <div className="row">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2">Video Manager</h1>
              <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group me-2">
                  <button type="button" className="btn btn-sm btn-outline-secondary">Profile</button>
                  <button type="button" className="btn btn-sm btn-outline-secondary">Settings</button>
                </div>
              </div>
            </div>
            <div className="row justify-content-start align-items-start g-2">
              <div className="col-md-12">
                <div className="table-responsive">
                  <table className="table table-striped
                  table-hover	
                  table-bordered
                  table-primary
                  align-middle">
                    <thead className="table-light">
                      <tr>
                        <th width="10">No</th>
                        <th>File</th>
                        <th>Preview</th>
                        <th width="150">Action</th>
                      </tr>
                    </thead>
                    <tbody className="table-group-divider">
                      {fileList !== false && fileList.map((v, i) => {
                        return (<TrVideo file={v} key={i} no={i + 1} />)
                      })
                      }
                    </tbody>
                  </table>
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

export default VideoManager;

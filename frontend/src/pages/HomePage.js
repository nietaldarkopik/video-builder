import React from 'react';
import MainContainer from '../components/MainContainer';

const HomePage = () => {
  return (
    <>
      <div className="row">
          {/* <!-- Main Content --> */}
          <main className="col-md-12 ms-sm-auto col-lg-12 px-md-12">
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                  <h1 className="h2">Dashboard</h1>
                  <div className="btn-toolbar mb-2 mb-md-0">
                      <div className="btn-group me-2">
                          <button type="button" className="btn btn-sm btn-outline-secondary">Profile</button>
                          <button type="button" className="btn btn-sm btn-outline-secondary">Settings</button>
                      </div>
                  </div>
              </div>

              {/* <!-- Main content area --> */}
          </main>
      </div>
    </>
  );
};

export default HomePage;

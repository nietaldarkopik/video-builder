import { Link, Outlet} from 'react-router-dom';
import React from 'react';

const NoPage = () => {
  return (
    
    <div>
      <h1>404 Page</h1>

      <p>
        This example demonstrates how you can stitch two React Router apps
        together using the <code>`basename`</code> prop on{" "}
        <code>`BrowserRouter`</code> and <code>`StaticRouter`</code>.
      </p>
    </div>
  );
};

export default NoPage;

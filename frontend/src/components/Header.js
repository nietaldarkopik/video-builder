import React from "react";

const Header = () => {
    return (

        <header>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <a className="navbar-brand" href="#">Logo</a>
                    <button className="navbar-toggler" type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarNav" 
                        aria-controls="navbarNav" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="/">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/video-manager">Video Manager</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/video-downloader">Video Downloader</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/video-builder">Video Builder</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/find-video">Video Finder</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/content-builder">Content Creator</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header;
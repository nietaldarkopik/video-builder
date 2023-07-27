
const MainContainer = () => {
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
                        <div className="position-sticky">
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <a className="nav-link active" href="#">Dashboard</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Orders</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Products</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Customers</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Reports</a>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    {/* <!-- Main Content --> */}
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
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
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <h2>Welcome to the Admin Dashboard!</h2>
                                    <p>This is a simple admin dashboard template using Bootstrap 5.</p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

        </>
    )
}
export default MainContainer;
import { Outlet, Link } from "react-router-dom";

const MainContainer = () => {
    return (
        <>
            <div className="container-fluid">
                <Outlet />
            </div>
        </>
    )
}
export default MainContainer;
import React from 'react';
import { useHistory,NavLink } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

//common header for appliction
const Header = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const {token, initURL,authUser} = useSelector(({auth}) => auth);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_type");
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        dispatch({type: "SIGNOUT_USER_SUCCESS"});
        history.push("/");
    }

    return(
        <div  className="nax-bar-main ">
            <p>EFR Ticket System</p>
            <button className="welcome-btn link-btn">{`Welcome ${authUser.email}`}</button>
                <nav>
                <ul>
                    <li>
                    <NavLink to={`/createEFRTicket`}>Create EFR Ticket</NavLink>
                    </li>
                    <li>
                    <NavLink to={`/efrTicketResponse`}>EFR Ticket Responses</NavLink>
                    </li>
                    <li>
                        <button className="link-btn" onClick={logout}>Logout</button>
                    </li>
                </ul>
            </nav>
            
        </div>
    )
}

export default Header;
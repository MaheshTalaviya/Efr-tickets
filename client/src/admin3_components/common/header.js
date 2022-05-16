import React,{useState,useEffect} from 'react';
import { NavLink, useHistory } from "react-router-dom";
import setAuthToken from "../../utils/setAuthToken";
import axios from "axios";
import {SERVER_URL} from "../../constants";
import {useDispatch, useSelector} from "react-redux";
import {totalIssues,skipForeverTotalIssues,userSignout} from "../../appRedux/actions/Common";

//common header for appliction
const Header = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const [urgentTotal,setUrgentTotal] = useState(0);
    const [elevatedTotal,setElevatedTotal] = useState(0);
    const [normalTotal,setNormalTotal] = useState(0);
    const [skipForeverTotal,setSkipForeverTotal] = useState(0);

    const user = JSON.parse(window.localStorage.getItem("user"));
    const {totalUrgentIssues,totalElevatedIssues,totalNormalIssues,totalSkipForeverIssues} = useSelector(({common}) => common);
    const {token, initURL,authUser} = useSelector(({auth}) => auth);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_type");
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        dispatch(userSignout());
        history.push("/");
    }
    
    useEffect(()=>{
        setElevatedTotal(totalElevatedIssues);
        setNormalTotal(totalNormalIssues);
        setUrgentTotal(totalUrgentIssues);
        setSkipForeverTotal(totalSkipForeverIssues);
    },[totalNormalIssues,totalUrgentIssues,totalSkipForeverIssues,totalElevatedIssues]);

    const fetchData = () =>{
        try {

            dispatch(totalIssues({"admin_level":user.user_type}));
            dispatch(skipForeverTotalIssues({"admin_level":user.user_type}));
            
        } catch (e) {
            let passErr = e.response.data.message;
            console.log(passErr);
        }
   }



    useEffect(()=>{     
        if(user !== null)   {
            fetchData();
        }
    },[]);

    return(
        <div  className="nax-bar-main ">
            <p>EFR Ticket System</p>
            <button className="welcome-btn link-btn">{`Welcome ${authUser.email}`}</button>
                <nav>
                <ul>
                    <li>
                    <NavLink to={`/admin3/urgentEFRTicket`}>Urgent ({urgentTotal})</NavLink>
                    </li>
                    <li>
                    <NavLink to={`/admin3/elevatedEFRTicket`}>Elevated ({elevatedTotal})</NavLink>
                    </li>
                    <li>
                    <NavLink to={`/admin3/normalEFRTicket`}>Normal ({normalTotal})</NavLink>
                    </li>
                    <li>
                    <NavLink to={`/admin3/skipForeverEFRTicket`}>Skip forever ({skipForeverTotal})</NavLink>
                    </li>
                      <li>
                    <NavLink to={`/admin3/adminEcpRequest`}>ECP Request</NavLink>
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
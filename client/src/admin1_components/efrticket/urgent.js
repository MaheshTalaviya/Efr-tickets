import React, { useState,useEffect }  from 'react';
import Table from 'react-bootstrap/Table';
import axios from "axios";
import { Link, useHistory} from "react-router-dom";
import {SERVER_URL} from "../../constants";

import Header from "../common/header";

import SetEFRTicketResponse from './ticket_response';
import setAuthToken from "../../utils/setAuthToken";

//UrgentEFRTicket
const UrgentEFRTicket = () => {

    const History =  useHistory();
    //Manage token user login or not
	  if (localStorage.getItem("token") === null) {
	    History.push("/");
	  }
	  if (localStorage.getItem("user_type") === "AGENT" || localStorage.getItem("user_type") === "ADMIN2" || localStorage.getItem("user_type") === "ADMIN3") {
       
        History.push("/");
	  }
   
    const [efrTickets, setData] = useState([]);
    const [passErr, setPassErr] = useState();
    const user = JSON.parse(window.localStorage.getItem("user"));
    
    const fetchData = () =>{
        try {
            setAuthToken(); //  Important set token  from res.data to get token
            axios.get(SERVER_URL + `/api/efrticket/getEFRTicketByPriorityLevel/URGENT/ADMIN1/${user._id}`).then((res)=>{
                console.log("res",res.data);    
                if (res.data.status === true) {
                    setData(res.data.data);
                }
            })
        } catch (e) {
            let passErr = e.response.data.message;
            setPassErr(passErr);
            console.log(passErr);
            setTimeout(function () {
                setPassErr("");
            }, 3000);
        }
   }

    useEffect(()=>{        
        if(user!== null){
            fetchData();
        }
    },[]);

    return(
        <div>
            <Header/>
            <div className="container">
            		<div className="_vertical-center">
            			<div className="main-div">
                        <p style={{color:'red'}}>{passErr}</p>
                        {
                                efrTickets.length > 0 ? (
                                    <SetEFRTicketResponse efrTicketData={efrTickets}  fetchData={fetchData}/>
                                ):
                                (
                                    <h4 className="content">No data</h4>
                                )
                        }
                       
                        </div>
                    </div>    
                </div>
            
        </div>
    )
}

export default UrgentEFRTicket;
import React, {useEffect,useState }  from 'react';
import Header from "../common/header";

import Table from 'react-bootstrap/Table';
import axios from "axios";
import { Link, useHistory} from "react-router-dom";
import {SERVER_URL} from "../../constants";
import setAuthToken from "../../utils/setAuthToken";

const EFRTicketResponse = () => {

    const History =  useHistory();
    //Manage token user login or not
	  if (localStorage.getItem("token") === null) {
	    History.push("/");
	  }
	  if (localStorage.getItem("user_type") === "ADMIN3" || localStorage.getItem("user_type") === "ADMIN1" || localStorage.getItem("user_type") === "ADMIN2") {
        History.push("/");
	  }

    const [efrTicketResponse, setData] = useState([]);
    const [passErr, setPassErr] = useState();
    const [passSuccess, setPassSucess] = useState();
    const user = JSON.parse(window.localStorage.getItem("user"));

    const fetchData = () =>{
        try {
            setAuthToken(); //  Important set token  from res.data to get token
            axios.get(SERVER_URL + `/api/efrticket/getEFRTicket/${user._id}`).then((res)=>{

                console.log("res", res.data);
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
        if(user !== null)   {
            fetchData();
        }
    },[]);

    const closeEFRTicket = (id) => {
        try {
            setAuthToken(); //  Important set token  from res.data to get token
            axios.get(SERVER_URL + `/api/efrticket/closeEFRTicket/${id}`).then((res)=>{

                console.log("res", res.data);
                if (res.data.status === true) {
                    setPassSucess(res.data.message);  
                    fetchData();
                    setTimeout(function () {
                        setPassSucess("");
                    }, 3000); 
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
    return(
        <div>
            <Header/>
            <div className="container">
            		<div className="_vertical-center">
            			<div className="main-div">
                        <p style={{color:'green'}}>{passSuccess}</p>
                        <p style={{color:'red'}}>{passErr}</p>
                        <Table id="table">
                            <thead>
                                <tr>
                                    <th>Email of lead</th>
                                    <th>Response from admin</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                efrTicketResponse.length > 0 ? (
                                    efrTicketResponse.map(( item, index ) => {
                                        return (
                                            <tr key={index}>
                                            <td>{item.email}</td>
                                            <td id={"td_"+(index+1)} dangerouslySetInnerHTML={{__html: item.email_thread_response}} />
                                            <td className="btn-section">
                                                
                                                <button type="button" className="btn btn-primary" onClick={() => closeEFRTicket(item._id)}>Close</button>
                                                <Link to={`/updateEFRTicket/${item._id}`} className="btn btn-primary">Update</Link>
                                                
                                            </td>
                                            </tr>
                                        );
                                        })
                                ):(
                                    <tr>
                                        <td colSpan={3}> No Records Found </td>
                                    </tr>
                                )
                            }
                            </tbody>
                            </Table>
                        </div>
                    </div>    
                </div>
            
        </div>
    )
}

export default EFRTicketResponse;
import React, { useState,useEffect }  from 'react';
import axios from "axios";
import { Link, useHistory} from "react-router-dom";
import {SERVER_URL} from "../../constants";

import Header from "../common/header";
import setAuthToken from "../../utils/setAuthToken";

//common footer for appliction
const AssignAgents = () => {

    const History =  useHistory();
    //Manage token user login or not
	  if (localStorage.getItem("token") === null) {
	    History.push("/");
	  }
	  if (localStorage.getItem("user_type") === "AGENT" || localStorage.getItem("user_type") === "ADMIN1" || localStorage.getItem("user_type") === "ADMIN3") {
        History.push("/");
	  }
   
    const [agents, setAgents] = useState([]);
    const [withAdmin1Agents, setWithAdmin1agents] = useState([]);
    const [admin1Users, setAdmin1Users] = useState([]);

    const [passErr, setPassErr] = useState();
    const [passSuccess, setPassSucess] = useState();
    const user = JSON.parse(window.localStorage.getItem("user"));

    const fetchData = () =>{
        try {
            console.log("assign")
            setAuthToken(); //  Important set token  from res.data to get token
            axios.get(SERVER_URL + "/api/users/getAllUsers").then((res)=>{
                console.log(res.data);
                if (res.data.status === true) {
                    let agentsArray = [];
                    let withAdmin1AgentsArray = [];
                    let admin1UsersArray = [];

                    res.data.data.forEach(element => {
                        if(element.adminid === null && element.user_type === "AGENT"){
                            agentsArray.push(element);
                        }
                        
                        if(element.adminid !== null  && element.user_type === "AGENT"){
                            withAdmin1AgentsArray.push(element);
                        }

                        if(element.user_type === "ADMIN1"){
                            admin1UsersArray.push(element);
                        }
                    });
                    setAgents(agentsArray);
                    setWithAdmin1agents(withAdmin1AgentsArray);
                    setAdmin1Users(admin1UsersArray);
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

    const allowDrop = (ev) => {
        ev.preventDefault();
      }
      
      const drag = (ev,agent) =>{
        var j = JSON.stringify({"id":ev.target.id,"agent":agent});
        ev.dataTransfer.setData("object", j);
        
      }
      
      const drop = async (ev,admin)=> {
        ev.preventDefault();
        var data = JSON.parse(ev.dataTransfer.getData("object"));
        ev.target.appendChild(document.getElementById(data.id));

        console.log(data.agent,admin);
        let res = "";
        try {
            let adminid = admin !== null ? admin._id : null;
            setAuthToken(); //  Important set token  from res.data to get token
            res = await axios.post(SERVER_URL + "/api/users/updateUser", {
                id:data.agent._id,
                adminid:adminid
            });
            console.log("res", res.data);
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
                    <div className="main-div assign-content">
                        <div className="assign-body">
                            <p className="assign-title">Agents</p>   
                            <div id="div1" className="div-box" onDrop ={(event)=>drop(event,null)} onDragOver={(event)=>allowDrop(event)}>
                                {
                                    agents.map(( item, index ) => {
                                        return (
                                                <p draggable="true" key={index} onDragStart={(event)=>drag(event,item)} id={`drag_agent_` + (index+1)}>{item.email}</p>
                                            )
                                    })
                                }
                                
                            </div>
                        </div>
                     
                    {
                            admin1Users.map(( admin, index ) => {
                                return (
                                    <div className="assign-body">
                                        <p className="assign-title">Admin1 - {admin.name}</p>  
                                        <div id={`div_`+ (index+1)} className="div-box" onDrop ={(event)=>drop(event,admin)} onDragOver={(event)=>allowDrop(event)}>
                                            {
                                                withAdmin1Agents.map(( agent, index ) => {
                                                    if(agent.adminid === admin._id)
                                                    return (
                                                            <p draggable="true" key={index} onDragStart={(event)=>drag(event,agent)} id={`drag_withadminagent_` + (index+1)}>{agent.email}</p>
                                                        )
                                                })
                                            }
                                        </div>
                                    </div>
                                    )
                            })
                        }
                   </div>
                </div>    
            </div>
        
    </div>
    )
}

export default AssignAgents;
import axios from 'axios';
import setAuthToken from "../../utils/setAuthToken";

import {SERVER_URL} from "../../constants";

export const totalIssues = ({admin_level}) => {
    console.log(admin_level);
    const user = JSON.parse(window.localStorage.getItem("user"));

    return (dispatch) => {
      
      setAuthToken(); //  Important set token  from res.data to get token
      axios.get(SERVER_URL + `/api/efrticket/getTotalIssues/${admin_level}/${user._id}`).then((res)=>{
        console.log(res.data);
          if (res.data.status === true) {
            dispatch({type: "SET_TATAL_NORMAL_ISSUES",payload:0});
            dispatch({type: "SET_TATAL_URGENT_ISSUES",payload:0});
            dispatch({type: "SET_TATAL_ELEVATED_ISSUES",payload:0});
              
              res.data.data.forEach(element => {
                  if(element._id === "NORMAL"){
                    dispatch({type: "SET_TATAL_NORMAL_ISSUES",payload:element.count});
                  }
                  if(element._id === "URGENT"){
                    dispatch({type: "SET_TATAL_URGENT_ISSUES",payload:element.count});
                  }
                  if(element._id === "ELEVATED"){
                    dispatch({type: "SET_TATAL_ELEVATED_ISSUES",payload:element.count});
                  }
              });  
          }
      });     
    }
  };

  
export const skipForeverTotalIssues = ({admin_level}) => {
  const user = JSON.parse(window.localStorage.getItem("user"));
    console.log(admin_level);
    return (dispatch) => {
      
      setAuthToken(); //  Important set token  from res.data to get token
            axios.get(SERVER_URL + `/api/efrticket/getTotalSkipForeverEFRTicket/${admin_level}/${user._id}`).then((res)=>{
                console.log(res.data);
                dispatch({type: "SET_TATAL_SKIPFOREVER_ISSUES",payload:0});
                if (res.data.status === true) {
                    dispatch({type: "SET_TATAL_SKIPFOREVER_ISSUES",payload:res.data.data});
                    // setSkipForeverTotal(res.data.data);
                }
            })
    }
  };

  export const userSignout = () => {
    
    return (dispatch) => {
        dispatch({type: "RESET"});
        dispatch({type: "SIGNOUT_USER_SUCCESS"});
    }
  };


import React, { useState,useEffect }  from 'react';
import axios from "axios";
import { useHistory,useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import { Editor } from '@tinymce/tinymce-react';
import {SERVER_URL, TINYMCE_KEY} from "../../constants";
import setAuthToken from "../../utils/setAuthToken";
import {totalIssues,skipForeverTotalIssues} from "../../appRedux/actions/Common";
import { PromiseProvider, set } from 'mongoose';

//SetEFRTicketResponse
const SetEFRTicketResponse = ({efrTicketData,fetchData}) => {

    const history = useHistory();
    const dispatch = useDispatch();

    const { register, handleSubmit, reset,errors } = useForm();
    const [passErr, setPassErr] = useState();
    const [passSuccess, setPassSucess] = useState();
    const [email_thread_response_error, setEmailThreadReponseError] = useState(false);
    const [email_thread_response, setEmailThreadReponse] = useState("");
    const [efrTickets, setData] = useState({...efrTicketData});

    const user = JSON.parse(window.localStorage.getItem("user"));

    const [efrTicket, setEFRTicket] = useState({});
    const [i,setI] = useState(0);
    const [count,setCount] = useState(0);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        setData(efrTicketData);
        setEFRTicket(efrTicketData[i]);
        setDisabled(false);
      }, [efrTicketData]);

    const onSubmit = async (data,e) =>{
        let res = "";
        if(email_thread_response !== "" ){

        try {
            setDisabled(true);
            setAuthToken(); //  Important set token  from res.data to get token
            res = await axios.post(SERVER_URL + "/api/efrticket/updateEFRTicket", {
                id:efrTicket._id,
                email_thread_response: email_thread_response,
                admin: user._id,
                status:"APPROVED"
            });
            console.log("res", res.data);

            if (res.data.status === true) {
                dispatch(totalIssues({"admin_level":user.user_type}));
                dispatch(skipForeverTotalIssues({"admin_level":user.user_type}));
             
                e.target.reset();
                setEmailThreadReponse('');
                setPassSucess(res.data.message);
                setEmailThreadReponseError(false);
                let x = i +1;
                setI(x);
                setDisabled(false);
                // setPassSucess("EFR Ticket Elevate !");
                if(efrTickets.length > x){
                    setEFRTicket(efrTickets[x]);
                    console.log(efrTicket)
                }else{
                    console.log("No data");
                }
                setTimeout(function () {
                    setPassSucess("");
                }, 3000);
            }
        } catch (e) {
            let passErr = e.response.data.message;
            setPassErr(passErr);
            setDisabled(false);
            console.log(passErr);
            setTimeout(function () {
                setPassErr("");
            }, 3000);

            //console.log("pass", e.response.data.message);
        }
        }else{
            setEmailThreadReponseError(true);   
        }
    
    }

    const elevate = async (id)=>{
        let res = "";
       try {
        setDisabled(true);
        setAuthToken(); //  Important set token  from res.data to get token
            res = await axios.post(SERVER_URL + "/api/efrticket/updateEFRTicket", {
                admin_level:"ADMIN2",
                status:"OPEN",
                id:id
            });
            console.log("res", res.data);

            if (res.data.status === true) {
                dispatch(totalIssues({"admin_level":user.user_type}));
                dispatch(skipForeverTotalIssues({"admin_level":user.user_type}));
             
                let x = i +1;
                setI(x);
                setPassSucess("EFR Ticket Elevate !");
                setDisabled(false);
                if(efrTickets.length > x){
                    setEFRTicket(efrTickets[x]);
                }else{
                    console.log("No data");
                }
                setTimeout(function () {
                    setPassSucess("");
                    
                }, 3000);
            }
        } catch (e) {
            let passErr = e.response.data.message;
            setPassErr(passErr);
            setDisabled(false);
            console.log(passErr);
            setTimeout(function () {
                setPassErr("");
            }, 3000);

        }
    }

    const skipForNow = ()=>{
        let c = count +1;
        setCount(c);
        setEmailThreadReponse('');
        let x = i +1;
        setI(x);
        if(efrTickets.length > x){
            setEFRTicket(efrTickets[x]);
        }else{
            console.log("No data");
        }
        setPassSucess("EFR Ticket Skip for now !");
        setTimeout(function () {
            setPassSucess("");
        }, 3000);
    }

    const skipForever = async (id)=>{
        let res = "";
       try {
        setDisabled(true);
        setAuthToken(); //  Important set token  from res.data to get token
            res = await axios.post(SERVER_URL + "/api/efrticket/updateEFRTicket", {
                status:"SKIPFOREVER",
                id:id
            });
            console.log("res", res.data);

            if (res.data.status === true) {
                dispatch(totalIssues({"admin_level":user.user_type}));
                dispatch(skipForeverTotalIssues({"admin_level":user.user_type}));
             
                let x = i +1;
                setI(x);
                
                setDisabled(false);
                if(efrTickets.length > x){
                    setEFRTicket(efrTickets[x]);
                }else{
                    console.log("No data");
                }
                setPassSucess("EFR Ticket Skip forever !");
                setTimeout(function () {
                    setPassSucess("");
                }, 3000);
            }
        } catch (e) {
            let passErr = e.response.data.message;
            setPassErr(passErr);
            setDisabled(false);
            console.log(passErr);
            setTimeout(function () {
                setPassErr("");
            }, 3000);
        }
    }

    const  startFromFirst = () => {
        setCount(0);
        setI(0);
        setDisabled(true);

        fetchData();
    }

    const handleEditorChange = (content, editor) => {
        
        if(content !== ""){
            setEmailThreadReponse(content);
            setEmailThreadReponseError(false); 
         }else{
            setEmailThreadReponseError(true);   
        }
        console.log('Content was updated:', content);
      }

    return(
        <div>
                <p style={{color:'green'}}>{passSuccess}</p>
                <p style={{color:'red'}}>{passErr}</p>
                               
                        {
                            efrTickets.length > i ? (
                            <>
                              <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="cut-box">
                                            <label className="text-heading">Agent email : </label>
                                            <label className="text-value">{efrTicket.agent_email}</label>
                                        </div>
                                        <div className="cut-box">
                                            <label className="text-heading">Email of lead : </label>
                                            <label className="text-value">{efrTicket.email}</label>
                                        </div>
                                         <div className="cut-box">
                                            <label className="text-heading">Series : </label>
                                            <label className="text-value">{ efrTicket && efrTicket.series?.toLowerCase()}</label>
                                        </div>

                                        <div className="cut-box">
                                            <label className="text-heading">See thread : </label>
                                            <p className="editor-value" dangerouslySetInnerHTML={{__html: efrTicket.email_thread}} />
                                        </div>
                                        
                                        <div className="cut-box">
                                            <label htmlFor="email_thread_response"  className="text-heading">Response</label>
                                            <Editor
                                            apiKey={`${TINYMCE_KEY}`}
                                             value={email_thread_response}
                                            init={{
                                            height: 500,
                                            menubar: false,
                                            plugins: [
                                                'advlist autolink lists link image charmap print preview anchor',
                                                'searchreplace visualblocks code fullscreen',
                                                'insertdatetime media table paste code help wordcount'
                                            ],
                                            toolbar:
                                                'undo redo | formatselect | bold italic backcolor | \
                                                alignleft aligncenter alignright alignjustify | \
                                                bullist numlist outdent indent | removeformat | help'
                                            }}
                                            onEditorChange={handleEditorChange}
                                        />
                                    {email_thread_response_error && <p className="error-msg"> Email Thread Response is required. </p>}
                                        </div>
                                        <div className="more-select button-section">
                                            <div className="input-box-web">
                                            <button type="submit" className="btn btn-success"  disabled={disabled}>SUBMIT</button>
                                            <button type="button" className="btn btn-primary"  disabled={disabled} onClick={()=>elevate(efrTicket._id)}>Elevate</button>
                                            <button type="button" className="btn btn-primary"  disabled={disabled} onClick={()=>skipForNow()}>Skip for now</button>
                                            <button type="button" className="btn btn-primary"  disabled={disabled} onClick={()=>skipForever(efrTicket._id)}>Skip for forever</button>
                                            </div>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                count === 0 ? 
                                (
                                    <h4 className="content">Queue is currently empty !</h4>
                                ) 
                                :
                                (
                                    <div className="content">
                                    <h4>You have reached the end of the queue, would you like to go back to the start?</h4>
                                    <br/>
                                    <button type="button" className="btn btn-primary"  disabled={disabled} onClick={startFromFirst}>See first item</button>
                                    </div>
                                )
                                
                            )
                        }
                        
        </div>
    )
}

export default SetEFRTicketResponse;
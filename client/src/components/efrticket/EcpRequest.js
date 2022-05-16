import React, { useState }  from 'react';
import axios from "axios";
import { useForm } from "react-hook-form";
import {SERVER_URL, TINYMCE_KEY} from "../../constants";
import { Editor } from '@tinymce/tinymce-react';
import Header from "../common/header";
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from 'react-router-dom';
import setAuthToken from "../../utils/setAuthToken";

//CreateEFRTicket
const EcpRequest = () => {

    const History =  useHistory();
    const [uploadfiles,setUploadFiles]=useState('')
   
    
    const [email, setEmail] = useState("");
    const [email_thread, setEmailThread] = useState("");
    const [email_thread_error, setEmailThreadError] = useState(false);
    const [priority_level, setPriorityLevel] = useState("NORMAL");
    const [series_level, setSeriesLevel] = useState("VOYAGE");

    const { register, handleSubmit, errors } = useForm();
    const [passErr, setPassErr] = useState();
    const [passSuccess, setPassSucess] = useState();
    const [disabled, setDisabled] = useState(false);
    const {token, initURL,authUser} = useSelector(({auth}) => auth);

    const user = JSON.parse(window.localStorage.getItem("user"));
    const seriesValue = window.localStorage.getItem("default_series");

    const onSubmit = async (data,e) =>{
        // e.preventDefault();
        
        console.log("email_thead",email_thread);
        if(email_thread !== ""){
        let res = "";
        
        try {
            setDisabled(true);
           
            let filesdata=uploadfiles
            var fileData = new FormData();
              for (let i =0; i<filesdata.length; i++){
                fileData.append("file", filesdata[i], filesdata[i].name);
                
              }

            fileData.append("email",email );
            fileData.append("email_thread",email_thread );
            fileData.append("agent_email",user.email );
            fileData.append("series",series_level );
            fileData.append("agentId",user._id );
            
            setAuthToken(); //  Important set token  from res.data to get token
            res = await axios.post(SERVER_URL + "/api/uploadFile/imagesUploads/", fileData,{headers:{'Content-Type':'multipart/form-data'}});
            console.log("res", res.data);

            if (res.data.status === true) {
                setPassSucess(res.data.message);
                setEmail('');
                setEmailThread('');
                setPriorityLevel('NORMAL');
                
                setSeriesLevel(window.localStorage.getItem("default_series"))
                setEmailThreadError(false);   
                e.target.reset();
                setDisabled(false);
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
         setEmailThreadError(true);   
        }
    }

    const handleEditorChange = (content, editor) => {
        
        if(content !== ""){
            setEmailThread(content);
            setEmailThreadError(false); 
         }else{
            setEmailThreadError(true);   
        }
        console.log('Content was updated:', content);
      }
     const seriesOnchage=(e)=>{
        window.localStorage.setItem("default_series", e.target.value);
        setSeriesLevel(e.target.value)
     } 
     
     const  onChangeHandler =(event)=> {
    const files = event.target.files;
   
    setUploadFiles(files)
   
  }
    return(
        <div>
            <Header/>
            <div className="container">
            		<div className="_vertical-center">
            			<div className="main-div">
                            
                        <p style={{color:'green'}}>{passSuccess}</p>
                        <p style={{color:'red'}}>{passErr}</p>
                        {
                            authUser.adminid !== null ?
                        
                        <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="cut-box">
                                    <label htmlFor="email">Email</label>
                                    <input className="text-box-cust" 
                                     value={email}
                                     onChange={(e) => setEmail(e.target.value)}
                                     ref={register({
                                       required: true,
                                       pattern: {
                                         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                         message: "invalid email address",
                                       },
                                     })}
                                    type="text" id="email" name="email" placeholder="Email"/>
                                    
                                    {errors.email && <p className="error-msg"> Email is required.</p>}
                                </div>
                                
                                <div className="cut-box">
                                    <label htmlFor="email_thread">Email Thread</label>
                                    
                                    <Editor
                                            value={email_thread}
                                            apiKey={`${TINYMCE_KEY}`}
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
                                    {email_thread_error && <p className="error-msg"> Email Thread is required. </p>}
                                </div>

                                <div className="cut-box">
                                    <label htmlFor="priority_level">Upload Files</label>
                                    <div className="">
                                       
                                       <input type="file" name="myfile" accept='file_extension' multiple={true} onChange={onChangeHandler} onClick={(event)=> {event.target.value = null}}  />
                                    </div>
                                  
                                </div>
<br/>
                                 <div className="more-select cut-box" onChange={(e)=>{seriesOnchage(e)}} >
                                    <label htmlFor="priority_level">Series</label>
                                    <div className="input-box-web">
                                        <input type="radio" value="VOYAGE" defaultChecked={seriesValue==='VOYAGE' ? true: false} name="series_level" ref={register({ required: true })} /> <span > Voyage</span >
                                        <input type="radio" value="SHOUTOUT" defaultChecked={seriesValue==='SHOUTOUT' ? true: false} name="series_level" ref={register({ required: true })} /><span > Shoutout</span >
                                       
                                    </div>
                                    {errors.priority_level && <p className="error-msg"> Priority Level is required. </p>}
                                </div>
                                
                                <div className="more-select">
                                    <div className="input-box-web">
                                    <button type="submit" className="btn btn-success" disabled={disabled}>SUBMIT</button>
                                    </div>
                                </div>
                            </form>
                            :
                            (
                                <h4  className="content">Please email administrator to assign admin</h4>
                            )
                        }
                        </div>
                    </div>    
                </div>
            
        </div>
    )
}

export default EcpRequest;
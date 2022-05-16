import {useEffect,useState} from 'react'
import Select from 'react-select';
import axios from "axios";
import {SERVER_URL,TINYMCE_KEY} from "../../constants";
import setAuthToken from "../../utils/setAuthToken";
import Header from '../common/header'
import { Editor } from '@tinymce/tinymce-react';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css'
const ECPNotes =() =>{
  const notify = () => toast.success("Your response successfully submited.");
const user = JSON.parse(window.localStorage.getItem("user"));
const [apiRespones,setApiResponse]=useState('')
const [cityApiResponse,setCityApiResponse]=useState('');
const [pageNumber,setPageNumber]=useState(1);
const [pageNextpage,setNextPahe]=useState(true);

const [isData,setIsData]=useState(false)
const [adminResponse,setAdminResponse]=useState('')
const [agentResponse,setAgentResponse]=useState('')

const adminresponseChange =(content, editor)=>{
setAdminResponse(content)
}
const agentResponseChnage =(content,editor)=>{
setAgentResponse(content)
}
    useEffect(()=>{
      dataApiCall(1)
    },[])
    const dataApiCall=(page)=>{
   
             let sendObj={
      page:page,status:'AGENT_UPLOAD'
    }
     try {
            setAuthToken(); //  Important set token  from res.data to get token
          axios.post(SERVER_URL + "/api/uploadFile/paginateFileData", {
               data:sendObj
            }).then((response) => {
            if(response.data?.results?.length !== 0){
               setIsData(true)
            }else{
             //  toast.error("No record found.")
              setIsData(false)
            }      
            setCityApiResponse(response.data)
            }, (error) => {
                console.log(error);
             });
        } catch (e) {
       console.log(e)
        }
}
const nextClick=()=>{
   
   if(pageNextpage ){
    let pageN = pageNumber + 1
    dataApiCall(pageN)  
    setPageNumber(pageN) 
   }
      
    
   
}


const previousClick=()=>{
  if(pageNumber > 1 ){
    let pageN = pageNumber - 1
    dataApiCall(pageN)  
    setPageNumber(pageN)
  }
     
}
const submitResponse=(id)=>{
let sendObj={
    id:id,
    agentResponse:agentResponse,
    adminResponse:adminResponse,
    admin3Name:user.name
}

   try {
            setAuthToken(); //  Important set token  from res.data to get token
          axios.post(SERVER_URL + "/api/uploadFile/updateResponse", {
               data:sendObj
            }).then((response) => {
            setAdminResponse('')
            setAgentResponse('')
            notify()
           dataApiCall(1)
            }, (error) => {
                console.log(error);
             });
        } catch (e) {
       console.log(e)
        }
}
    
           return( <div>
            <Header/>
            <ToastContainer hideProgressBar={true}  />
            <div className="container">
            		<div className="_vertical-center">
                 <div><br/>  Total ECP Request : {cityApiResponse?.total}</div>  
                <div className="main-div" style={{borderRadius:"5px",background:"#f2f2f2",padding:"10px",margin:"10px 0px"}}>
                
                  {cityApiResponse && cityApiResponse.results?.map((item)=>{
     
           return(<div><div style={{display:"flex"}}> <label className="text-heading">Agent Files : </label><ul style={{padding:"0px 0px" }}>{item.userFiles.map((it)=>{return(<li style={{listStyle:"none"}}><div className="">
             
                     <a href={'http://localhost:5000/uploads/'+it} target="_blank">{it} </a></div></li>)})}</ul></div>
                     <div className="">
                                            <label className="text-heading">Agent Email : </label>
                                            <label className="text-value">{item.agentEmail}</label>
                                        </div>
                                        <div className="">
                                            <label className="text-heading">Email of Lead : </label>
                                            <label className="text-value">{item.leadEmail}</label>
                                        </div>
                                        <div className="">
                                            <label className="text-heading">Series : </label>
                                            <label className="text-value">{item.series.toLowerCase()}</label>
                                        </div>
                                        <div className="">
                                            <label className="text-heading">See thread : </label>
                                            <p className="editor-value" dangerouslySetInnerHTML={{__html: item.threadEmail}} />
                                        </div>
                     <div className="" >
                       
                                            <label className="text-heading">Agent Response : </label>
                                            
                                              {/* <textarea value={agentResponse} onChange={agentResponseChnage}/> */}
                                                   <Editor
                                             apiKey={`${TINYMCE_KEY}`}
                                                value={agentResponse}
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
                                                onEditorChange={agentResponseChnage}
                                            />
                                              
                                        </div>
                                        <div className="" >
                                            <label className="text-heading">Admin3 Response : </label>
                                          
                                              {/* <textarea value={adminResponse} onChange={adminresponseChange}/> */}
                                              <Editor
                                             apiKey={`${TINYMCE_KEY}`}
                                                value={adminResponse}
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
                                                onEditorChange={adminresponseChange}
                                            />
                                              
                                        </div>
                                        <button  style={{display:isData?"block":"none"}}  onClick={()=>{submitResponse(item._id)}} className="btn btn-success">Submit</button>
                     </div>)})}
                     <div style={{display:"flex"}}>
      <button  style={{display:isData?"block":"none"}}disabled={pageNumber > 1 ? false: true}  onClick={previousClick} className="btn btn-primary">Previous</button>
    <button  style={{display:isData?"block":"none"}} disabled={pageNumber < cityApiResponse?.total && cityApiResponse ?false:true} onClick={nextClick} className="btn btn-primary">Next</button>
    
    </div>
                 
                </div>
                  </div></div></div>)
}
export default ECPNotes
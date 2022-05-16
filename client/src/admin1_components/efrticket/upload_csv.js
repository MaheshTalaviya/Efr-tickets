import {useState} from 'react'
import axios from "axios";
import {SERVER_URL} from "../../constants";
import CSVReader from "react-csv-reader";
import setAuthToken from "../../utils/setAuthToken";
import Header from '../common/header'

const UplaodCsv=()=>{

const [email,setEmail]= useState('')
const [IG,setIG]= useState('') 
const [city,setCity]= useState('') 
const [csvObj,setCsvObj]= useState('')  
const handleForce = (data, fileInfo) => {setCsvObj(data)};

const papaparseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
};


const emailValue =(e)=>{
    setEmail(e.target.value)
}
const igValue =(e)=>{
    setIG(e.target.value)
}
const cityValue =(e)=>{
    setCity(e.target.value)
}
const dataSubmit=()=>{
    let sendObj={
        email:email,
        ig:IG,
        city:city,
        csvObj:csvObj
    }

      try {
            setAuthToken(); //  Important set token  from res.data to get token
           axios.post(SERVER_URL + "/api/efrticket/updateEFRTicket", {
               data:sendObj
            }).then((response) => {
              alert('data submited');
              
            }, (error) => {
                console.log(error);
             });
        } catch (e) {
       console.log(e)
        }
    
}

    return <div>
            <Header/>
            <div className="container">
            		<div className="_vertical-center">
            			<div className="main-div">
                           
                            <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email</label>
                            <input type="email" className="form-control" aria-describedby="emailHelp" value={email} onChange={(e)=>{emailValue(e)}} placeholder="Enter email" />
                            </div>

                             <div className="form-group">
                            <label htmlFor="exampleInputPassword1">CSV</label>
                                <CSVReader
                                cssClass="react-csv-input"
                              
                                onFileLoaded={handleForce}
                                parserOptions={papaparseOptions}
                                />
                            </div>

                            <div className="form-group">
                            <label htmlFor="exampleInputPassword1">IG</label>
                            <input type="text" className="form-control" value={IG} onChange={(e)=>{igValue(e)}} id="exampleInputPassword1" />
                            </div>

                            <div className="form-group">
                            <label htmlFor="exampleInputPassword1">City</label>
                            <input type="text" className="form-control" value={city} onChange={(e)=>{cityValue(e)}} />
                            </div>
                          
                            <button type="submit" onClick={dataSubmit} className="btn btn-primary">Submit</button>
     
  
                        </div>
                     
                    </div>    
                </div>
            
        </div>
}
export default UplaodCsv
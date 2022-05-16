import React, { useEffect,useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import setAuthToken from "../utils/setAuthToken";
import {SERVER_URL} from "../constants";
import Select from 'react-select';

const Register = () => {
    
    const history = useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const { register, handleSubmit, errors } = useForm();
    const [passErr, setPassErr] = useState();
    const [passSuccess, setPassSuccess] = useState();
    const [disabled, setDisabled] = useState(false);
    const [userSelect, setUserSelect] = useState(null);
     const [citySelect, SetCitySelect] = useState('All');
     const [cityDisplayStatus,setCityDisplayStatus]=useState(false);

    const options = [
        { value: 'LEAD', label: 'Lead Gen Agents' },
        { value: 'DUP', label: 'Dup Check Agents' },
        { value: 'OUTREACH', label: 'Outreach Agents' },
    ];

    const cityOptions = [
        { value: 'surat', label: 'surat' },
        { value: 'bharuch', label: 'bharuch' },
        { value: 'test', label: 'test' },
    ];

const userSelectChnage=(value)=>{
    
     setUserSelect( value)
     if(value.value==='OUTREACH'){
        setCityDisplayStatus(true)
     }else{
         setCityDisplayStatus(false)
     }
}
const cityChnage=(value)=>{
  
     SetCitySelect( value)
}

    useEffect(()=>{
        let isAuthenticated = Boolean(window.localStorage.getItem("isAuthenticated"));
        let user_type = window.localStorage.getItem("user_type");
        if(user_type!==null && isAuthenticated){
            if(user_type==="AGENT"){
                history.push("/createEFRTicket");
            }else if(user_type==="ADMIN1"){
                history.push("/admin1/urgentEFRTicket");
            }else if(user_type==="ADMIN2"){
                history.push("/admin2/urgentEFRTicket");
            }else{
                history.push("/admin3/urgentEFRTicket");
            }
        }
    },[]);

    const onSubmit = async (e) =>{
        // e.preventDefault();
        console.log("call")
    let res = "";

    try {
        console.log(citySelect)
        setDisabled(true);
        res = await axios.post(SERVER_URL + "/api/userAgentsusers/register", {
            name:name,
            email: email,
            password: password,
            user_type:userSelect.value ,
            city: citySelect.value
        })
       
        if (res.data.status === true) {
            setPassSuccess(res.data.message);
            setTimeout(function () {
                setPassSuccess("");
                setDisabled(false);
                history.push("/user/login");
            }, 3000);
        }
      
        } catch (e) {
            let passErr = e.response?.data?.message;
            setPassErr(passErr);
            console.log(passErr);
            setTimeout(function () {
                setPassErr("");
                setDisabled(false);
            }, 3000);

            //console.log("pass", e.response.data.message);
        }
        console.log("submit")
    }
    return (
        <>
            <div className="container">
                <div className="_vertical-center">
                  <div className="main-div">
                        <p style={{color:'green'}}>{passSuccess}</p>
                        <p style={{color:'red'}}>{passErr}</p>
                        <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="cut-box">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" className="text-box-cust" placeholder="User Name" 
                                    name="name"
                                     value={name}
                                     onChange={(e) => setName(e.target.value)}
                                     ref={register({ required: true })}
                                    />
                                    {errors.name && <p className="error-msg"> Name is required. </p>}
                                </div>

                                <div className="cut-box">
                                    <label htmlFor="email">Email</label>
                                    <input type="text" className="text-box-cust" placeholder="Email"
                                     name="email"
                                     value={email}
                                     onChange={(e) => setEmail(e.target.value)}
                                     ref={register({
                                       required: true,
                                       pattern: {
                                         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                         message: "invalid email address",
                                       },
                                     })}
                                      />
                                    {errors.email && <p className="error-msg"> Email is required.</p>}
                                </div>
                                
                                <div className="cut-box">
                                    <label htmlFor="email_thread">Password</label>
                                    <input type="text" className="text-box-cust" placeholder="Password" 
                                    name="password"
                                     value={password}
                                     onChange={(e) => setPassword(e.target.value)}
                                     ref={register({ required: true })}
                                    />
                                    {errors.password && <p className="error-msg"> Password is required. </p>}
                                </div>
                                 <div className="cut-box">
                                    <label htmlFor="email_thread">Agents Type</label>
                                       <Select
                                            value={userSelect}
                                            onChange={(e)=>{userSelectChnage(e)}}
                                            options={options}
                                        />    
                                    </div> 
 <br/>
                                    <div className="cut-box" style={{display: cityDisplayStatus ?'block':'none'}} >
                                    <label htmlFor="email_thread">city</label>
                                       <Select
                                            value={citySelect}
                                            onChange={(e)=>{cityChnage(e)}}
                                            options={cityOptions}
                                        />    
                                    </div> 
                                     <br/>
                                <div className="more-select">
                                    <div className="input-box-web">
                                        <button type="submit" disabled={disabled} className="btn btn-success">Register</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>    
                </div>
        </>
    )

}
export default Register;
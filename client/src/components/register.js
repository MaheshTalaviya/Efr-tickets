import React, { useEffect,useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import setAuthToken from "../utils/setAuthToken";
import {SERVER_URL} from "../constants";

const Register = () => {
    
    const history = useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const { register, handleSubmit, errors } = useForm();
    const [passErr, setPassErr] = useState();
    const [passSuccess, setPassSuccess] = useState();
    const [disabled, setDisabled] = useState(false);

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
        
    let res = "";

    try {
        setDisabled(true);
        res = await axios.post(SERVER_URL + "/api/users/register", {
            name:name,
            email: email,
            password: password,
            user_type: "AGENT"
        });
        console.log("res", res.data);
        if (res.data.status === true) {
            setPassSuccess(res.data.message);
            setTimeout(function () {
                setPassSuccess("");
                setDisabled(false);
                history.push("/");
            }, 3000);
        }
      
        } catch (e) {
            let passErr = e.response.data.message;
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
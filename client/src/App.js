import React, { useEffect } from 'react';
import {BrowserRouter as Router,Route,Switch,Redirect} from 'react-router-dom';
import routes from './routes/routes';
import {useDispatch, useSelector} from "react-redux";

import "./style/css/style.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/login';
import Register from './components/register';


function App() {

  // const {isAuthenticated} = useSelector(({auth}) => auth);
  
  return (
    <div>
    <Router>
        <Switch>
            <Route path="/" component={Login} exact />
            <Route path="/register" component={Register} exact />
       
            
                {routes.map(({path,Component,userType},index)=>{
                  return (
                    <PrivateRoute path={path} key={index} exact component={Component} user_type={userType} />
                  )
                })}
            <Route path="*">
              
              <div>404 Not found </div>
            </Route>
        </Switch>
    </Router>
    </div>
  );
}

function PrivateRoute ({component: Component,user_type, ...rest}) {
  console.log("----user_type",user_type)
  const isAuthenticated = Boolean(window.localStorage.getItem("isAuthenticated"));
  let userType = window.localStorage.getItem("user_type");
  console.log("isAuthenticated",isAuthenticated);
  return (
    <Route
      {...rest}
      render={(props) => isAuthenticated === true && user_type === userType
        ? <Component {...props} />
        : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
    />
  )
}

export default App;

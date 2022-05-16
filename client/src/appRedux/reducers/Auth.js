
const INIT_STATE = {
  token: null,//localStorage.getItem('token')!==null ?JSON.parse(localStorage.getItem('token')):null,
  initURL: '',
  authUser: localStorage.getItem('user')!==null ?JSON.parse(localStorage.getItem('user')):null,
  isAuthenticated : false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {


    case "INIT_URL": {
      return {...state, initURL: action.payload};
    }

    case "SIGNOUT_USER_SUCCESS": {
      return {
        ...state,
        token: null,
        authUser: null,
        initURL: '',
        isAuthenticated:false
      }
    }

    case "IS_AUTHENTICATED": {
      return {
        ...state,
        isAuthenticated:true
      }
    }

    case "USER_DATA": {
      return {
        ...state,
        authUser: action.payload,
      };
    }

    case "USER_TOKEN_SET": {
      return {
        ...state,
        token: action.payload,
      };
    }

    default:
      return state;
  }
}

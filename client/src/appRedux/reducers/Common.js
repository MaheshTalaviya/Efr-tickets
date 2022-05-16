const INIT_STATE = {
  error: "",
  loading: false,
  message: '',
  totalUrgentIssues : 0,
  totalNormalIssues : 0,
  totalElevatedIssues : 0,
  totalSkipForeverIssues : 0,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case "fetchData_START": {
      return {...state, error: '', message: '', loading: true};
    }
    case "fetchData_SUCCESS": {
      return {...state, error: '', message: '', loading: false};
    }
    case "SHOW_MESSAGE": {
      return {...state, error: '', message: action.payload, loading: false};
    }
    case "fetchData_ERROR": {
      return {...state, loading: false, error: action.payload, message: ''};
    }
    case "HIDE_MESSAGE": {
      return {...state, loading: false, error: '', message: ''};
    }
    case "SET_TATAL_URGENT_ISSUES" : {
      return {...state, totalUrgentIssues: action.payload, message: ''};
    }
    case "SET_TATAL_NORMAL_ISSUES" : {
      return {...state, totalNormalIssues: action.payload, message: ''};
    }
    case "SET_TATAL_ELEVATED_ISSUES" : {
      return {...state, totalElevatedIssues: action.payload, message: ''};
    }
    case "SET_TATAL_SKIPFOREVER_ISSUES" : {
      return {...state, totalSkipForeverIssues: action.payload, message: ''};
    }
    case "RESET": {
      return {
        ...state,
        error: "",
        loading: false,
        message: '',
        totalUrgentIssues : 0,
        totalNormalIssues : 0,
        totalElevatedIssues : 0,
        totalSkipForeverIssues : 0,
      }
    }
    default:
      return state;
  }
}

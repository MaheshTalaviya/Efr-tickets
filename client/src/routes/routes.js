import Login from '../components/login';
import Register from '../components/register';
import CreateEFRTicket from '../components/efrticket/createEFRTicket';
import EFRTicketResponse from '../components/efrticket/efrTicketResponse';
import UpdateEFRTicket from '../components/efrticket/updateEFRTicket';
import UrgentEFRTicket from '../admin1_components/efrticket/urgent';
import NormalEFRTicket from '../admin1_components/efrticket/normal';
import SkipForeverEFRTicket from '../admin1_components/efrticket/skip_forever';
import ElevatedEFRTicket from '../admin1_components/efrticket/elevated';
import ADMIN2UrgentEFRTicket from '../admin2_components/efrticket/urgent';
import ADMIN2NormalEFRTicket from '../admin2_components/efrticket/normal';
import ADMIN2SkipForeverEFRTicket from '../admin2_components/efrticket/skip_forever';
import ADMIN2ElevatedEFRTicket from '../admin2_components/efrticket/elevated';
import AssignAgents from '../admin2_components/agent/assignAgents';
import ADMIN3UrgentEFRTicket from '../admin3_components/efrticket/urgent';
import ADMIN3NormalEFRTicket from '../admin3_components/efrticket/normal';
import ADMIN3SkipForeverEFRTicket from '../admin3_components/efrticket/skip_forever';
import ADMIN3ElevatedEFRTicket from '../admin3_components/efrticket/elevated';
import EcpRequest from '../components/efrticket/EcpRequest'
import EcpNotes from '../admin2_components/efrticket/ecpNotes'
import EcpRequest3 from '../admin3_components/efrticket/ecpRequest'
const routes = [
    // {
    //     path:"/",
    //     Component:Login
    // },
    // {
    //     path:"/register",
    //     Component:Register
    // },
    {
        path:"/admin3/adminEcpRequest",
        Component:EcpRequest3,
        userType : "ADMIN3"

    },
 {
        path:"/admin2/ecpNotes",
        Component:EcpNotes,
        userType : "ADMIN2"

    },
 
    {
        path:"/ecpRequest",
        Component:EcpRequest,
        userType : "AGENT"

    },
    {
        path:"/createEFRTicket",
        Component:CreateEFRTicket,
        userType : "AGENT"

    },
    {
        path:"/efrTicketResponse",
        Component:EFRTicketResponse,
        userType : "AGENT"
    },
    {
        path:"/updateEFRTicket/:id",
        Component:UpdateEFRTicket,
        userType : "AGENT"
    },
    {
        path:"/admin1/urgentEFRTicket",
        Component:UrgentEFRTicket,
        userType : "ADMIN1"
    },
    {
        path:"/admin1/elevatedEFRTicket",
        Component:ElevatedEFRTicket,
        userType : "ADMIN1"
    },
    {
        path:"/admin1/normalEFRTicket",
        Component:NormalEFRTicket,
        userType : "ADMIN1"
    },
    {
        path:"/admin1/skipForeverEFRTicket",
        Component:SkipForeverEFRTicket,
        userType : "ADMIN1"
    },

    {
        path:"/admin2/urgentEFRTicket",
        Component:ADMIN2UrgentEFRTicket,
        userType : "ADMIN2"
    },
    {
        path:"/admin2/elevatedEFRTicket",
        Component:ADMIN2ElevatedEFRTicket,
        userType : "ADMIN2"
    },
    {
        path:"/admin2/normalEFRTicket",
        Component:ADMIN2NormalEFRTicket,
        userType : "ADMIN2"
    },
    {
        path:"/admin2/skipForeverEFRTicket",
        Component:ADMIN2SkipForeverEFRTicket,
        userType : "ADMIN2"
    },
    {
        path:"/admin2/assignAgents",
        Component:AssignAgents,
        userType : "ADMIN2"
    },
    

    {
        path:"/admin3/urgentEFRTicket",
        Component:ADMIN3UrgentEFRTicket,
        userType : "ADMIN3"
    },
    {
        path:"/admin3/elevatedEFRTicket",
        Component:ADMIN3ElevatedEFRTicket,
        userType : "ADMIN3"
    },
    {
        path:"/admin3/normalEFRTicket",
        Component:ADMIN3NormalEFRTicket,
        userType : "ADMIN3"
    },
    {
        path:"/admin3/skipForeverEFRTicket",
        Component:ADMIN3SkipForeverEFRTicket,
        userType : "ADMIN3"
    },
];

export default routes;
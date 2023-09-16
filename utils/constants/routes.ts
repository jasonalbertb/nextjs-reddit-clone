const DASHBOARD = "/";
const R_SLASH_ROUTE = "/r/:communityID";
const R_SLASH = (communityID: string)=>{
    return R_SLASH_ROUTE.replace(":communityID", communityID);
}
const PROFILE_ROUTE = '/u/:profileID';
const PROFILE = (id:string)=>{
    return PROFILE_ROUTE.replace(":profileID", id)
}
const SETTINGS = '/settings';
const ADVERTISE =  '/advertise';
const COINS = '/coins'; 
//policies
const PRIVICY_POLICY = '/policies/privacy';
const USER_AGREEMENT = '/policies/user-agreement';

const CREATE_POST_ROUTE = `${R_SLASH_ROUTE}/submit`;
const CREATE_POST_ROUTE_2 = '/submit';
const CREATE_POST =  (communityID:string="")=>{
    if (communityID === '') {
        return CREATE_POST_ROUTE_2
    }else{
        return CREATE_POST_ROUTE.replace(":communityID", communityID);
    }
}
const POST_COMMENT_ROUTE = '/:type/:communityID/comments/:postID';
const POST_COMMENT = ({communityID, postID}: {communityID : string, postID : string})=>{
    const str = POST_COMMENT_ROUTE.replace(":type", 'r').replace(":communityID", communityID);
    return str.replace(':postID', postID);
}
const USER_POSTCOMMENT = ({communityID, postID}: {communityID : string, postID : string})=>{
    const str = POST_COMMENT_ROUTE.replace(":type", 'u').replace(":communityID", communityID);
    return str.replace(':postID', postID);
}


export const ROUTES = {
    DASHBOARD,
    R_SLASH_ROUTE, R_SLASH,
    PROFILE_ROUTE, PROFILE,
    SETTINGS,
    ADVERTISE,
    COINS,
    PRIVICY_POLICY, USER_AGREEMENT,
    CREATE_POST_ROUTE,
    CREATE_POST,
    POST_COMMENT, USER_POSTCOMMENT
} 

export const communitySearchParams = {
    MEDIA : 'media',
    URL : 'url'
}
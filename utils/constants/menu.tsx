import {BsArrowUpRightCircle, BsChatSquare} from "react-icons/bs";
import {BiBarChartAlt} from "react-icons/bi";
import {FaHome} from "react-icons/fa";

import {FaRegStar} from "react-icons/fa";
import {FiMonitor} from "react-icons/fi";
import {BsController, BsThreeDots, BsChatDots, BsBell} from "react-icons/bs";
import {BiBaseball, BiLineChart, BiCoinStack} from "react-icons/bi";
import {AiOutlinePlus} from "react-icons/ai";

export const MENU_TYPES = {
  COIN : "coin",
  CHAT : "chat",
  NOTIF : "notif"
}

export const communities = [
    "announcements",
    "Genshin_Impact"
]
  
export  const feeds = [
    {
      title : "home",
      url : "/",
      logo : (className: string)=>{
        return <FaHome className={className}/>
      }
    },
    {
      title : "popular",
      url : "/r/popular",
      logo : (className: string)=>{
        return <BsArrowUpRightCircle className={className}/>
      }
    },
    {
      title : "all",
      url : "/r/all",
      logo : (className: string)=>{
        return <BiBarChartAlt className={className}/>
      }
    },
    {
      title : "happening now",
      url : "/r/now",
      logo : (className: string)=>{
        return <BsChatSquare className={className}/>
      }
    },
  ]

export const topics = [
  {
    title : "gaming",
    url : "/gaming",
    logo : (className : string)=>{
      return <BsController className={className}/>
    }
  },
  {
    title : "sports",
    url : "/sports",
    logo : (className: string)=>{
      return <BiBaseball className={className}/>
    }
  },
  {
    title : "business",
    url : "/business",
    logo : (className: string)=>{
      return <BiLineChart className={`${className} line-clamp-1`}/>
    }
  },
  {
    title : "crypto",
    url : "/crypto",
    logo : (className: string)=>{
      return <BiCoinStack className={className}/>
    }
  },
  {
    title : "television",
    url : "/television",
    logo : (className: string)=>{
      return <FiMonitor className={className}/>
    }
  },
  {
    title : "celebrity",
    url : "/celebrity",
    logo : (className: string)=>{
      return <FaRegStar className={className}/>
    }
  },
  {
    title : "more topics",
    url : "/more_topics",
    logo : (className: string)=>{
      return <BsThreeDots className={className}/>
    }
  },
]

export const navSection1 = [
  {
    title : "popular",
    url : "/r/popular",
    logo : (className: string)=>{
      return <BsArrowUpRightCircle className={className}/>
    }
  },
  {
    title : "coin",
    type : MENU_TYPES.COIN,
    logo : (className: string)=>{
      return <BiCoinStack className={className}/>
    }
  },
  {
    title : "happening now",
    url : "/r/now",
    logo : (className: string)=>{
      return <BsChatSquare className={className}/>
    }
  },
]

export const navSection2 = [
  {
    title: "chat",
    type : MENU_TYPES.CHAT,
    logo : (className: string)=>{
      return <BsChatDots className={className}/>
    }
  },
  {
    title : "notifications",
    type : MENU_TYPES.NOTIF,
    logo : (className: string)=>{
      return <BsBell className={className}/>
    }
  },
  {
    title : "Create post",
    url : "/submit",
    logo : (className: string )=>{
      return <AiOutlinePlus className={className}/>
    }
  },
]
import React from 'react'
import {RiFileListFill} from "react-icons/ri";
import {BiImage, BiListOl} from "react-icons/bi";
import {BsLink45Deg , BsMic} from "react-icons/bs";
import {ImgVideoTab} from '@/components/LHS/CreatePostLHS/tabs/ImgVideoTab'
import {LinkTab} from '@/components/LHS/CreatePostLHS/tabs/LinkTab'
import {PostTab} from '@/components/LHS/CreatePostLHS/tabs/PostTab'
export const tabs = [
  {
    name: 'post',
    Icon: RiFileListFill ,
    disabled: false,
    Tab: <PostTab />
  },
  {
    name: 'image & video',
    Icon: BiImage ,
    disabled: false,
    Tab : <ImgVideoTab />
  },
  {
    name: 'link',
    Icon: BsLink45Deg ,
    disabled: false,
    Tab : <LinkTab />
  },
  {
    name: 'poll',
    Icon:  BiListOl,
    disabled: true,
    Tab : <></>
  },
  {
    name: 'talk',
    Icon: BsMic,
    disabled: true,
    Tab : <></>
  },
]


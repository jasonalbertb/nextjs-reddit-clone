'use client'
import { DashboardLHS } from "@/components/LHS/DashboardLHS/page";
import { DashBoardRHS } from "@/components/RHS/DashboardRHS";
//components
import {NavPageWrapper} from "@/components/layouts/NavPageWrapper";


export default function Home() {
  return (
    <NavPageWrapper >
      <DashboardLHS />
      <DashBoardRHS />
    </NavPageWrapper>
  )
}

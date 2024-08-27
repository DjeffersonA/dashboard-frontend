"use client"
import SideNav from "@/components/sidenav.component"
import { usePathname } from "next/navigation"

export default function AppContext({children}:{children: React.ReactNode}): React.ReactNode{
    const pathName = usePathname();
    return(
        <>
            <SideNav page={pathName}>
                {children}
            </SideNav>
        </>
    )
}
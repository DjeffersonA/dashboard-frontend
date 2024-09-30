"use client"
import SideNav from "@/components/sidenav.component";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function AppContext({ children }: { children: React.ReactNode }): React.ReactNode {
    const pathName = usePathname();
    // const { data: session, status } = useSession();
    // const router = useRouter();

    // useEffect(() => {
    //     if (status === "unauthenticated") {
    //         router.push("/api/auth/signin");
    //     }
    // }, [status, router]);

    // if (status === "loading") {
    //     return <div>Carregando...</div>;
    // }

    return (
        <SideNav page={pathName}>
            {children}
        </SideNav>
    );
}
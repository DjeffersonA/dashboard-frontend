"use client";
import SideNav from "@/components/sidenav.component";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, ReactNode } from "react";

export default function AppContext({ children }: { children: ReactNode }): JSX.Element {
  const pathName = usePathname();
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); 
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="container bg-muted/40">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <SideNav page={pathName}>
        {children}
      </SideNav>
    );
  }

  return (
    <div className="container bg-muted/40">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
    </div>
  );
}
"use client";
import SideNav from "@/components/sidenav.component";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, ReactNode } from "react";
import Image from "next/image";

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
      <div className="bg-muted/40 relative">
        <Image
          src="/FGI_LIGHT_FULL.png"
          alt="Logo Light"
          width={258}
          height={68}
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 block dark:hidden"
        />
        <Image
          src="/FGI_DARK_FULL.png"
          alt="Logo Dark"
          width={258}
          height={68}
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 hidden dark:block"
        />
        <div className="container relative pt-16">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
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
    <div className="bg-muted/40 relative">
        <Image
          src="/FGI_LIGHT_FULL.png"
          alt="Logo Light"
          width={258}
          height={68}
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 block dark:hidden"
        />
        <Image
          src="/FGI_DARK_FULL.png"
          alt="Logo Dark"
          width={258}
          height={68}
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 hidden dark:block"
        />
        <div className="container relative pt-16">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
    </div>
  );
}
import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarCheck2,
  Gauge,
  AlignJustify,
} from "lucide-react";


interface SidenavProps {
  children: React.ReactNode;
  page: string;
}

interface SidenavLinkProps {
  href?: string;
  title: string;
  icon: ReactNode;
  slug: string;
  items?: {
    href: string;
    title: string;
  }[];
}

interface HoverSidenavLinkProps extends SidenavLinkProps {
  isHover?: boolean;
  isLocked?: boolean;
  selected: string;
}

function SidenavItems({
  href,
  title,
  icon,
  isHover = true,
  isLocked = true,
  items,
  slug,
  selected,
}: HoverSidenavLinkProps) {
  const [openAccordion, setOpenAccordion] = useState(false);
  const [selectedPage, setSelectedPage] = useState(selected);

  useEffect(() => {
    if (selected.indexOf("/", 1) !== -1) {
      const x = selected.split("/")[1];
      setSelectedPage("/" + x);
    }
  }, [selected]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(
        "openAccordion" + slug.replaceAll("/", "")
      );
      if (storedValue !== null) {
        setOpenAccordion(storedValue === "true");
      }
    }
  }, [slug]);

  return (
    <>
      {href ? (
        <Link
          href={href}
          className={`flex justify-center relative py-2 pr-5 pl-10 w-full ease-in-out duration-300 ${
            slug === selectedPage
              ? "bg-primary/15 text-primary before:absolute before:top-0 before:bottom-0 before:right-0 before:border-l-4 before:border-solid before:border-l-primary before:rounded-l"
              : "hover:bg-foreground/5 "
          }`}
        >
          <div
            className={`${(isHover || isLocked) && "mr-4"} ${
              slug === selectedPage && "text-primary"
            } fill-foreground/60 text-foreground/60`}
          >
            {icon}
          </div>
        </Link>
      ) : (
        <>cu</>
      )}
    </>
  );
}

const links: SidenavLinkProps[] = [
  {
    href: "/",
    title: "Dashboard",
    slug: "/",
    icon: <Gauge className="h-5 w-5" />,
  },
  {
    href: "/configuracoes",
    title: "Configuracoes",
    slug: "/configuracoes",
    icon: <CalendarCheck2 className="h-5 w-5" />,
  },
];

const variants = {
  expanded: {
    width: "288px",
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  collapsed: {
    width: "96px",
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

export default function Sidenav({ children, page }: SidenavProps) {

  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div
          className={`inset-y-0 left-0 z-10 hidden xl:flex flex-col border-r bg-sidenav-blur2 noScrollBar`}
          style={{ position: "fixed", width: "96px" }}
        >
          <nav className="flex flex-col w-full">
            <div className="pt-6 px-5 pb-4">
              <div className="flex justify-center items-center">
                <AlignJustify className="w-10 h-10" />
              </div>

              <div className="w-full flex justify-center mt-6">
                <Image
                  src={"/logo_fgi.png"}
                  alt="Logo"
                  width={96}
                  height={96}
                />
              </div>
            </div>
            <div>
              {links.map((link) => (
                <div key={link.title}>
                  <SidenavItems {...link} selected={page} />
                </div>
              ))}
            </div>
          </nav>
        </div>
        <main className={`grid flex-1 items-start xl:px-28 mb-20 sm:mb-0`}>
          {children}
        </main>
      </div>
    </>
  );
}

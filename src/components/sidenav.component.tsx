import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlignJustify,
  Settings,
  Home,
  ChartNoAxesCombined,
  Landmark,
  LogOut,
} from "lucide-react";
import PaidIcon from '@mui/icons-material/Paid';
import Groups2Icon from '@mui/icons-material/Groups2';
import { signOut, useSession } from "next-auth/react";


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
            title={title}
          >
            {icon}
          </div>
        </Link>
      ) : (
        <>Não há informação</>
      )}
    </>
  );
}

const links: SidenavLinkProps[] = [
  {
    href: "/",
    title: "Início",
    slug: "/",
    icon: <Home className="h-5 w-5" />,
  },
  {
    href: "/financeiro",
    title: "Contas a Receber",
    slug: "/financeiro",
    icon: <Landmark className="h-5 w-5" />,
  },
  {
    href: "/contasapagar",
    title: "Contas a Pagar",
    slug: "/contasapagar",
    icon: <PaidIcon className="h-5 w-5" />,
  },
  {
    href: "/marketing",
    title: "Marketing",
    slug: "/marketing",
    icon: <ChartNoAxesCombined className="h-5 w-5" />,
  },
  {
    href: "/comercial",
    title: "Comercial",
    slug: "/comercial",
    icon: <Groups2Icon className="h-5 w-5" />,
  },
  {
    href: "/configuracoes",
    title: "Configurações",
    slug: "/configuracoes",
    icon: <Settings className="h-5 w-5" />,
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
  const { status, data: session } = useSession();

  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div
          className={`inset-y-0 left-0 z-10 hidden xl:flex flex-col border-r bg-sidenav-blur2 noScrollBar`}
          style={{ position: "fixed", width: "96px" }}
        >
          <nav className="flex flex-col w-full h-full justify-between">
            <div>
              <div className="pt-6 px-5 pb-4">
                <div className="flex justify-center items-center">
                  <AlignJustify className="w-5 h-5" />
                </div>

                <div className="w-full flex justify-center mt-6">
                  <Image
                    src="/FGI_LIGHT.png"
                    alt="Logo Light"
                    width={96}
                    height={96}
                    className="block dark:hidden"
                  />
                  <Image
                    src="/FGI_DARK.png"
                    alt="Logo Dark"
                    width={96}
                    height={96}
                    className="hidden dark:block"
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
            </div>
            <div className="flex flex-col justify-center items-center mt-auto mb-5 space-y-2">
              <button><LogOut onClick={() => signOut()} className="h-5 w-5" color="red"/></button>
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

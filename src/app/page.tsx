"use client";
import { useState, useEffect } from 'react';
import { getProviders, signIn, useSession, ClientSafeProvider } from 'next-auth/react';
import AppContext from '@/context/app.context';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ModeToggle } from '@/components/modetoggle';

type Providers = Record<string, ClientSafeProvider> | null;

export default function Home() {
  const { status, data: session } = useSession();
  const [providers, setProviders] = useState<Providers>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };

    fetchProviders();
  }, []);

  if (status === "loading") {
    return (
      <div className="bg-gray-300 dark:bg-muted/40 relative">
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

  if (session && session.user) {
    return (
      <AppContext>
        Home
      </AppContext>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-300 dark:bg-muted/40">
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-md bg-muted/80 dark:bg-muted/100">
        <div className="w-full flex justify-center mt-6">
          <Image
            src="/FGI_LIGHT_FULL.png"
            alt="Logo Light"
            width={258}
            height={68}
            className="block dark:hidden"
          />
          <Image
            src="/FGI_DARK_FULL.png"
            alt="Logo Dark"
            width={258}
            height={68}
            className="hidden dark:block"
          />
        </div>
        <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <div className="space-y-4">
          {providers && Object.values(providers).map((provider) => (
            <div key={provider.name} className="flex justify-center">
              <Button
                className="w-full flex items-center justify-center space-x-2"
                onClick={() => signIn(provider.id)}
              >
                <Image
                  src="/google-icon.svg"
                  alt="Google Logo"
                  width={20}
                  height={20}
                />
                <span>Continuar com Google</span>
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4 mt-4">
        <ModeToggle/>
      </div>
    </main>
  );
}
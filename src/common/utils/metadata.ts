import { Metadata } from 'next';

const pageMetadata: Record<string, { title: string; description: string }> = {
  "localhost:3000/": {
    title: "Dashboard",
    description: "Painel Inicial",
  },
  "localhost:3000/financeiro": {
    title: "Contas a Receber",
    description: "Dashboard da equipe de Contas a Receber",
  },
  "localhost:3000/contasapagar": {
    title: "Contas a Pagar",
    description: "Dashboard da equipe de Contas a Pagar",
  },
  "/marketing": {
    title: "Marketing",
    description: "Dashboard da equipe de Marketing",
  },
  "/comercial": {
    title: "Comercial",
    description: "Dashboard da equipe comercial",
  },
  "localhost:3000/configuracoes": {
    title: "Configurações",
    description: "Página de configurações",
  },
};

type Props = {
  params: { pathname: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const metadata = pageMetadata[params.pathname] || {};
  return {
    title: `${metadata.title || 'Dashboard'} | Faculdade FGI`,
    description: metadata.description || 'Faculdade de Gestão e Inovação',
  };
}
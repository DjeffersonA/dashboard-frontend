"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"

interface Conta {
  valor_mensalidade: string;
  valor_pago: string;
  data_pagamento: string;
  data_vencimento: string;
  curso: string;
}

interface ProgressBarProps {
  label: string;
  value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        {/* <CardDescription>
        Agosto/2024
        </CardDescription> */ }
      </CardHeader>
      <CardContent>
        R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </CardContent>
    </Card>
  );
};

interface FinanceiroProps {
  contas: Conta[];
}

const Cards: React.FC<FinanceiroProps> = ({ contas }) => {
  const [progress, setProgress] = useState({
    mensalidadeProgress: 0,
    pagosProgress: 0,
    pendenteProgress: 0,
    quitadoProgress: 0,
    atrasoProgress: 0,
    inadimplenciaProgress: 0,
    inadimplenciaGradProgress: 0,
    inadimplenciaPosProgress: 0,
  });

  useEffect(() => {
    const today: Date = new Date();
    const formatToday: string = today.toISOString().split('T')[0];

    const totalMensalidades = contas.reduce((sum, conta) => 
      sum + parseFloat(conta.valor_mensalidade || '0'
    ), 0);

    const totalPagos = contas.reduce((sum, conta) => (
      conta.data_pagamento != null ? sum + parseFloat(conta.valor_mensalidade || '0') : sum
    ), 0);

    const totalPendente = contas.reduce((sum, conta) => (
      conta.data_pagamento == null ? sum + parseFloat(conta.valor_mensalidade || '0') : sum
    ), 0);
    
    const totalQuitado = contas.reduce((sum, conta) => (
      conta.data_pagamento <= conta.data_vencimento ? sum + parseFloat(conta.valor_mensalidade || '0') : sum
    ), 0);
    
    const totalAtraso = contas.reduce((sum, conta) => (
      conta.data_pagamento > conta.data_vencimento ? sum + parseFloat(conta.valor_mensalidade || '0') : sum
    ), 0);
    
    const totalInadimplecia = contas.reduce((sum, conta) => (
      (formatToday > conta.data_vencimento && conta.valor_pago == null && conta.data_pagamento == null) 
        ? sum + parseFloat(conta.valor_mensalidade || '0') 
        : sum
    ), 0);
    
    const totalInadimpleciaGrad = contas.reduce((sum, conta) => (
      (formatToday > conta.data_vencimento && conta.valor_pago == null && conta.data_pagamento == null 
      && (!conta.curso.toLowerCase().includes('pós') && !conta.curso.toLowerCase().includes('mba'))) 
        ? sum + parseFloat(conta.valor_mensalidade || '0') 
        : sum
    ), 0);
    
    const totalInadimpleciaPos = contas.reduce((sum, conta) => (
      (formatToday > conta.data_vencimento && conta.valor_pago == null && conta.data_pagamento == null 
      && (conta.curso.toLowerCase().includes('pós') || conta.curso.toLowerCase().includes('mba'))) 
        ? sum + parseFloat(conta.valor_mensalidade || '0') 
        : sum
    ), 0);
    
    const interval = setInterval(() => {
      setProgress((prevProgress) => ({
        mensalidadeProgress: Math.min(prevProgress.mensalidadeProgress + totalMensalidades * 0.05, totalMensalidades),
        pagosProgress: Math.min(prevProgress.pagosProgress + totalPagos * 0.05, totalPagos),
        pendenteProgress: Math.min(prevProgress.pendenteProgress + totalPendente * 0.05, totalPendente),
        quitadoProgress: Math.min(prevProgress.quitadoProgress + totalQuitado * 0.05, totalQuitado),
        atrasoProgress: Math.min(prevProgress.atrasoProgress + totalAtraso * 0.05, totalAtraso),
        inadimplenciaProgress: Math.min(prevProgress.inadimplenciaProgress + totalInadimplecia * 0.05, totalInadimplecia),
        inadimplenciaGradProgress: Math.min(prevProgress.inadimplenciaGradProgress + totalInadimpleciaGrad * 0.05, totalInadimpleciaGrad),
        inadimplenciaPosProgress: Math.min(prevProgress.inadimplenciaPosProgress + totalInadimpleciaPos * 0.05, totalInadimpleciaPos),
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [contas]);

  return (
    <>
      <div className="mb-32 grid gap-2 text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <ProgressBar label="Receita Prevista" value={progress.mensalidadeProgress} />
        <ProgressBar label="Total Pago" value={progress.pagosProgress} />
        <ProgressBar label="Pendente" value={progress.pendenteProgress} />
        <ProgressBar label="Pago Pontualmente" value={progress.quitadoProgress} />
        <ProgressBar label="Pago em Atraso" value={progress.atrasoProgress} />
        <ProgressBar label="Inadimplência" value={progress.inadimplenciaProgress} />
        <ProgressBar label="Inadimplência - Graduação" value={progress.inadimplenciaGradProgress} />
        <ProgressBar label="Inadimplência - Pós" value={progress.inadimplenciaPosProgress} />
      </div>
    </> 
  );
};

export default Cards;


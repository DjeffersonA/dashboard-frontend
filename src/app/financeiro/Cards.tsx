"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import { CircleArrowUpIcon, CircleArrowDownIcon } from 'lucide-react';

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
  valueLast: number;
  type: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, valueLast, type }) => {
  const percentageChange = value ? ((value - valueLast) / valueLast) * 100 : 0;
  const isIncrease = value > valueLast;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        {/* <CardDescription>
          Agosto/2024
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </CardContent>
      <CardDescription className="relative flex justify-between items-left space-x-2 left-6 bottom-4">
      <span className="flex gap-1 leading-none text-sm">
        {type === true ? (
          isIncrease ? (
            <span className="text-green-500 flex items-center gap-1">
              <CircleArrowUpIcon className="h-4 w-4" color="green" />
              {"+"}
              {Math.abs(percentageChange).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
            </span>
          ) : (
            <span className="text-red-500 flex items-center gap-1">
              <CircleArrowDownIcon className="h-4 w-4" color="red" />
              {"-"}
              {Math.abs(percentageChange).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
            </span>
          )
        ) : (
          isIncrease ? (
            <span className="text-red-500 flex items-center gap-1">
              <CircleArrowUpIcon className="h-4 w-4" color="red" />
              {"+"}
              {Math.abs(percentageChange).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
            </span>
          ) : (
            <span className="text-green-500 flex items-center gap-1">
              <CircleArrowDownIcon className="h-4 w-4" color="green" />
              {"-"}
              {Math.abs(percentageChange).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
            </span>
          )
        )}
      </span>
      </CardDescription>
    </Card>
  );
};

interface FinanceiroProps {
  contas: Conta[];
  dataLastMonth: Conta[];
}

const Cards: React.FC<FinanceiroProps> = ({ contas, dataLastMonth }) => {
  const [progress, setProgress] = useState({
    mensalidadeProgress: 0,
    pagosProgress: 0,
    pendenteProgress: 0,
    quitadoProgress: 0,
    atrasoProgress: 0,
    inadimplenciaProgress: 0,
    inadimplenciaGradProgress: 0,
    inadimplenciaPosProgress: 0,
    totalMensalidadesLast:0, totalPagosLast:0, totalPendenteLast:0 , totalQuitadoLast:0 , totalAtrasoLast:0 , 
    totalInadimplenciaLast:0, totalInadimplenciaGradLast:0, totalInadimplenciaPosLast:0 
  });

  useEffect(() => {
    const today: Date = new Date();
    const formatToday: string = today.toISOString().split('T')[0];

    const totalMensalidades = contas.reduce((sum, conta) => 
      sum + parseFloat(conta.valor_mensalidade || '0'
    ), 0);

    const totalMensalidadesLast = dataLastMonth.reduce((sum, conta) => 
      sum + parseFloat(conta.valor_mensalidade || '0'
    ), 0);

    const totalPagos = contas.reduce((sum, conta) => (
      conta.data_pagamento != null ? sum + parseFloat(conta.valor_mensalidade || '0') : sum
    ), 0);
    
    const totalPagosLast = dataLastMonth.reduce((sum, conta) => (
      conta.data_pagamento != null ? sum + parseFloat(conta.valor_mensalidade || '0') : sum
    ), 0);

    const totalPendente = contas.reduce((sum, conta) => (
      conta.data_pagamento == null ? sum + parseFloat(conta.valor_mensalidade || '0') : sum
    ), 0);

    const totalPendenteLast = dataLastMonth.reduce((sum, conta) => (
      conta.data_pagamento == null ? sum + parseFloat(conta.valor_mensalidade || '0') : sum
    ), 0);
    
    const totalQuitado = contas.reduce((sum, conta) => (
      conta.data_pagamento <= conta.data_vencimento ? sum + parseFloat(conta.valor_mensalidade || '0') : sum
    ), 0);

    const totalQuitadoLast = dataLastMonth.reduce((sum, conta) => (
      conta.data_pagamento <= conta.data_vencimento ? sum + parseFloat(conta.valor_mensalidade || '0') : sum
    ), 0);
    
    const totalAtraso = contas.reduce((sum, conta) => (
      conta.data_pagamento > conta.data_vencimento ? sum + parseFloat(conta.valor_mensalidade || '0') : sum
    ), 0);

    const totalAtrasoLast = dataLastMonth.reduce((sum, conta) => (
      conta.data_pagamento > conta.data_vencimento ? sum + parseFloat(conta.valor_mensalidade || '0') : sum
    ), 0);
    
    const totalInadimplencia = contas.reduce((sum, conta) => (
      (formatToday > conta.data_vencimento && conta.valor_pago == null && conta.data_pagamento == null) 
        ? sum + parseFloat(conta.valor_mensalidade || '0') 
        : sum
    ), 0);

    const totalInadimplenciaLast = dataLastMonth.reduce((sum, conta) => (
      (formatToday > conta.data_vencimento && conta.valor_pago == null && conta.data_pagamento == null) 
        ? sum + parseFloat(conta.valor_mensalidade || '0') 
        : sum
    ), 0);
    
    const totalInadimplenciaGrad = contas.reduce((sum, conta) => (
      (formatToday > conta.data_vencimento && conta.valor_pago == null && conta.data_pagamento == null 
      && (!conta.curso.toLowerCase().includes('pós') && !conta.curso.toLowerCase().includes('mba'))) 
        ? sum + parseFloat(conta.valor_mensalidade || '0') 
        : sum
    ), 0);

    const totalInadimplenciaGradLast = dataLastMonth.reduce((sum, conta) => (
      (formatToday > conta.data_vencimento && conta.valor_pago == null && conta.data_pagamento == null 
      && (!conta.curso.toLowerCase().includes('pós') && !conta.curso.toLowerCase().includes('mba'))) 
        ? sum + parseFloat(conta.valor_mensalidade || '0') 
        : sum
    ), 0);
    
    const totalInadimplenciaPos = contas.reduce((sum, conta) => (
      (formatToday > conta.data_vencimento && conta.valor_pago == null && conta.data_pagamento == null 
      && (conta.curso.toLowerCase().includes('pós') || conta.curso.toLowerCase().includes('mba'))) 
        ? sum + parseFloat(conta.valor_mensalidade || '0') 
        : sum
    ), 0);

    const totalInadimplenciaPosLast = dataLastMonth.reduce((sum, conta) => (
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
        inadimplenciaProgress: Math.min(prevProgress.inadimplenciaProgress + totalInadimplencia * 0.05, totalInadimplencia),
        inadimplenciaGradProgress: Math.min(prevProgress.inadimplenciaGradProgress + totalInadimplenciaGrad * 0.05, totalInadimplenciaGrad),
        inadimplenciaPosProgress: Math.min(prevProgress.inadimplenciaPosProgress + totalInadimplenciaPos * 0.05, totalInadimplenciaPos),
        totalMensalidadesLast, totalPagosLast, totalPendenteLast, totalQuitadoLast, totalAtrasoLast, 
        totalInadimplenciaLast, totalInadimplenciaGradLast, totalInadimplenciaPosLast
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [contas, dataLastMonth]);

  return (
    <>
      <div className="mb-32 grid gap-2 text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <ProgressBar label="Receita Prevista" value={progress.mensalidadeProgress} valueLast={progress.totalMensalidadesLast} type={true} />
        <ProgressBar label="Total Pago" value={progress.pagosProgress} valueLast={progress.totalPagosLast} type={true} />
        <ProgressBar label="Pendente" value={progress.pendenteProgress} valueLast={progress.totalPendenteLast} type={false}/>
        <ProgressBar label="Pago Pontualmente" value={progress.quitadoProgress} valueLast={progress.totalQuitadoLast} type={true}/>
        <ProgressBar label="Pago em Atraso" value={progress.atrasoProgress} valueLast={progress.totalAtrasoLast} type={false}/>
        <ProgressBar label="Inadimplência" value={progress.inadimplenciaProgress} valueLast={progress.totalInadimplenciaLast} type={false}/>
        {/*
        <ProgressBar label="Inadimplência - Graduação" value={progress.inadimplenciaGradProgress} valueLast={progress.totalInadimplenciaGradLast} type={false}/>
        <ProgressBar label="Inadimplência - Pós" value={progress.inadimplenciaPosProgress} valueLast={progress.totalInadimplenciaPosLast} type={false}/>
        */}
      </div>
    </> 
  );
};

export default Cards;


"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, Banknote, ChartColumnIncreasing, Gauge } from 'lucide-react';

interface ContasAPagar {
  "Dia": string;
  "Data": string;
  " Lançamento ": string;
  "Pago": string;
  "Pendente": string;
  "Pagantes (%)": string;
  "A Pagar (%)": string;
  "A Pagar Hoje": string;
  "Hoje": string;
}

type GradientColor = 'blue' | 'purple' | 'pink' | 'orange';

const getGradientClass = (colorType: GradientColor): string => {
  switch (colorType) {
    case 'blue':
      return 'bg-gradient-to-r from-blue-600 via-blue-750 to-blue-900';
    case 'purple':
      return 'bg-gradient-to-r from-purple-600 via-purple-750 to-purple-900';
    case 'pink':
      return 'bg-gradient-to-r from-pink-600 via-pink-500 to-pink-400';
    case 'orange':
      return 'bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400';
    default:
      return 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-900'; // Cor padrão
  }
};

const getIcon = (colorType: GradientColor) => {
  switch (colorType) {
    case 'blue':
      return <Receipt className="w-9 h-9" color="white" />;
    case 'purple':
      return <Banknote className="w-9 h-9" color="white" />;
    case 'pink':
      return <ChartColumnIncreasing className="w-9 h-9" color="white" />;
    case 'orange':
      return <Gauge className="w-9 h-9" color="white" />;
    default:
      return <Receipt className="w-9 h-9" color="white" />;
  }
};

const ProgressBar: React.FC<{ label: string; value: number; colorType: GradientColor}> = ({ label, value, colorType }) => {
  const gradientClass = getGradientClass(colorType);
  const Icon = getIcon(colorType);

  return (
    <Card className={`text-white h-[90px] relative flex items-center ${gradientClass}`}>
      <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
        {Icon}
      </div>
      <div className="ml-14 flex-1 ">
        <CardHeader className="gap-2">
          <CardTitle>{label}</CardTitle>
          R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </CardHeader>
      </div>
    </Card>
  );
};

const formatMoney = (valor: string | undefined): number => {
  if (!valor || valor.includes('-')) {
    return 0;
  }
  const valorLimpo = valor.replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.');
  return parseFloat(valorLimpo) || 0;
};

const Cards: React.FC<{ contas: ContasAPagar[] }> = ({ contas }) => {
  const [totals, setTotals] = useState({
    totalLancado: 0,
    totalPago: 0,
    totalPendente: 0,
    aPagarHoje: 0,
  });

  useEffect(() => {
    const today = new Date();
    const formatToday = today.toLocaleDateString('pt-BR');

    const totalLancado = contas.reduce((sum, conta) => {
      const valorLancamento = formatMoney(conta[" Lançamento "]);
      return sum + valorLancamento;
    }, 0);

    const totalPago = contas.reduce((sum, conta) => {
      const valorPago = formatMoney(conta["Pago"]);
      return sum + valorPago;
    }, 0);

    const totalPendente = contas.reduce((sum, conta) => {
      const valorPendente = formatMoney(conta["Pendente"]);
      return sum + valorPendente;
    }, 0);

    const aPagarHoje = contas.reduce((sum, conta) => {
      if (conta["Data"] === formatToday) {
        const valorHoje = formatMoney(conta["A Pagar Hoje"]);
        return sum + valorHoje;
      }
      return sum;
    }, 0);

    setTotals({
      totalLancado,
      totalPago,
      totalPendente,
      aPagarHoje,
    });
  }, [contas]);

  return (
    <div className="mb-32 grid gap-2 text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
      <ProgressBar label="Total Lançado" value={totals.totalLancado} colorType="blue"/>
      <ProgressBar label="Total Pago" value={totals.totalPago} colorType="purple"/>
      <ProgressBar label="Total Pendente" value={totals.totalPendente} colorType="pink" />
      <ProgressBar label="A Pagar Hoje" value={totals.aPagarHoje} colorType="orange" />
    </div>
  );
};

export default Cards;
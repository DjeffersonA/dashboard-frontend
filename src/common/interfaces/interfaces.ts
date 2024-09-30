// Contas a Pagar

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

interface DataItem {
  Dia: number;
  "Pagantes (%)": string;
  "A Pagar (%)": string;
}

interface ChartProps {
  data: DataItem[];
}

// Contas a Receber

interface ContasAReceber {
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

interface CRProps {
  data: ContasAReceber[];
  dataLastMonth: ContasAReceber[];
}
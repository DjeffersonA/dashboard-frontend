"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import { CircleArrowUpIcon, CircleArrowDownIcon } from 'lucide-react';

interface MetaAds {
  campaign_name: string;
  adset_name: string;
  spend: string;
  date_start: string;
  date_stop: string;
}

interface ProgressBarProps {
  label: string;
  value: number;
  valueLast: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, valueLast }) => {
  const [percentageChange, setPercentageChange] = useState<number | null>(null);

  useEffect(() => {
    if (valueLast !== null) {
      const calculatedChange = valueLast ? ((value - valueLast) / valueLast) * 100 : 0;
      setTimeout(() => {
        setPercentageChange(calculatedChange);
      }, 0);
    }
  }, [value, valueLast]);
  const isIncrease = value > valueLast;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </CardContent>
      <CardDescription className="relative flex justify-between items-left space-x-2 left-6 bottom-4">
      <span className="flex gap-1 leading-none text-sm">
        {isIncrease ? (
            <span className="text-red-500 flex items-center gap-1">
              <CircleArrowUpIcon className="h-4 w-4" color="red" />
              {percentageChange !== null 
                ? `+${Math.abs(percentageChange).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
                : 'Carregando...'}
            </span>
        ) : (
            <span className="text-green-500 flex items-center gap-1">
              <CircleArrowDownIcon className="h-4 w-4" color="green" />
              {percentageChange !== null 
                ? `-${Math.abs(percentageChange).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
                : 'Carregando...'}
            </span>
        )}
      </span>
      </CardDescription>
    </Card>
  );
};

interface MarketingProps {
	data: MetaAds[];
  dataLastMonth: MetaAds[];
}

const Cards: React.FC<MarketingProps> = ({ data, dataLastMonth }) => {
  const [progress, setProgress] = useState({
    gastoTotalProgress: 0,
    gastoFormProgress: 0,
    gastoTrafegoProgress: 0,
    gastoTotalLast:0, gastoFormLast:0, gastoTrafegoLast:0
  });

  useEffect(() => {
    const gastoTotal = data.reduce((sum, item) => 
      sum + parseFloat(item.spend || '0'
    ), 0);

    const gastoTotalLast = dataLastMonth.reduce((sum, item) => 
      sum + parseFloat(item.spend || '0'
    ), 0);

    const gastoForm = data.reduce((sum: number, item: MetaAds): number => {
        const campaignIncludes = item.campaign_name.toLowerCase().includes('trafego') || item.campaign_name.toLowerCase().includes('tráfego');
        const adsetIncludes = item.adset_name.toLowerCase().includes('trafego') || item.adset_name.toLowerCase().includes('tráfego');

        return !(campaignIncludes || adsetIncludes) && item.spend != null 
          ? sum + parseFloat(item.spend || '0')
          : sum;
      }, 0);
    
    const gastoFormLast = dataLastMonth.reduce((sum: number, item: MetaAds): number => {
      const campaignIncludes = item.campaign_name.toLowerCase().includes('trafego') || item.campaign_name.toLowerCase().includes('tráfego');
      const adsetIncludes = item.adset_name.toLowerCase().includes('trafego') || item.adset_name.toLowerCase().includes('tráfego');
			
      return !(campaignIncludes || adsetIncludes) && item.spend != null 
        ? sum + parseFloat(item.spend || '0')
        : sum;
    }, 0);

    const gastoTrafego = data.reduce((sum: number, item: MetaAds): number => {
      const campaignIncludes = item.campaign_name.toLowerCase().includes('trafego') || item.campaign_name.toLowerCase().includes('tráfego');
      const adsetIncludes = item.adset_name.toLowerCase().includes('trafego') || item.adset_name.toLowerCase().includes('tráfego');
			
      return (campaignIncludes || adsetIncludes) && item.spend != null 
        ? sum + parseFloat(item.spend || '0')
        : sum;
    }, 0);

    const gastoTrafegoLast = dataLastMonth.reduce((sum: number, item: MetaAds): number => {
      const campaignIncludes = item.campaign_name.toLowerCase().includes('trafego') || item.campaign_name.toLowerCase().includes('tráfego');
      const adsetIncludes = item.adset_name.toLowerCase().includes('trafego') || item.adset_name.toLowerCase().includes('tráfego');
			
      return (campaignIncludes || adsetIncludes) && item.spend != null 
        ? sum + parseFloat(item.spend || '0')
        : sum;
    }, 0);
    
    const interval = setInterval(() => {
      setProgress((prevProgress) => ({
        gastoTotalProgress: Math.min(prevProgress.gastoTotalProgress + gastoTotal * 0.05, gastoTotal),
        gastoFormProgress: Math.min(prevProgress.gastoFormProgress + gastoForm * 0.05, gastoForm),
        gastoTrafegoProgress: Math.min(prevProgress.gastoTrafegoProgress + gastoTrafego * 0.05, gastoTrafego),
        gastoTotalLast, gastoFormLast, gastoTrafegoLast
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [data, dataLastMonth]);

  return (
    <>
      <div className="mb-32 grid gap-2 text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <ProgressBar label="Gasto Total" value={progress.gastoTotalProgress} valueLast={progress.gastoTotalLast} />
        <ProgressBar label="Gasto Form Meta" value={progress.gastoFormProgress} valueLast={progress.gastoFormLast} />
        <ProgressBar label="Gasto Tráfego" value={progress.gastoTrafegoProgress} valueLast={progress.gastoTrafegoLast} />
      </div>
    </> 
  );
};

export default Cards;


const formatMoney = (props: string | undefined): number => {
  if (!props || props.includes('-')) {
    return 0;
  }
  const replace = props.replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.');
  return parseFloat(replace) || 0;
};

const formatBRL = (props: string) => {
  const money = parseFloat(props);

  return (new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
  }).format(money));
}

const valueLabel = (props: any) => {
  if (props == 0)
    return ``;
  return `R$${props.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const percentLabel = (props: any) => {
  if (props == 0)
    return ``;
  return `${props}%`;
};

const capWords = (props: string): string => {
  const smallWords = new Set(['de', 'do', 'das', 'da', 'a', 'o', 'e', 'em', 'para', 'com', 'por']);
  
  return props
    .toLowerCase()
    .split(' ')
    .map((word, index, array) => {
      if (index === 0 || index === array.length - 1 || !smallWords.has(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
};

// Códigos de Curso
export function getCourseId(campaignName: string, adsetName: string): string {
  const courseIDs: { [key: string]: (RegExp | RegExp[])[] } = {
    "BMSC": [/BMSC/, /Banking/],
    "DHSC": [/DHSC/, /Direito do Agro/],
    "GASC": [/GASC/, /Gestão Estratégica do Agro/],
    "CASC": [/CASC/, /Contabilidade do Agro/],
    "NCSC": [/NCSC/, /Nutrição e Gestão/],
    "PCSC": [/PCSC/, /Gestão Estratégica da Pecuária/, /Pecuária de Corte/],
    "SFSC": [/SFSC/, /Solo/],
    "GFSC": [/GFSC/, /Gestão Financeira/],
    "GPC": [[/Gerente de Pecuária de Corte/]],
    "GA": [
      /EGA/, [/Online/, /Gestão do Agro/], /HGA/, [/Jataí/, /Gestão do Agro/], /Gestão do Agro/
    ],
    "SP": [
      /ESP/, /Segurança Pública/, [/Online/, /Gestão de Segurança/], /HSP/, [/Jataí/, /Gestão de Segurança/]
    ],
    "CC": [
      /ECC/, /Ciências Contábeis/, [/Online/, /Ciências Contábeis/], /HCC/, [/Jataí/, /Ciências Contábeis/]
    ],
    "GC": [
      /EGC/, /Gestão Comercial/, /HGC/
    ],
    "ADM": [
      [/EADM/], [/HADM/], /Administração/, [/Online/, /Administração/]
    ],
    "HDIR": [
      /HDIR/, [/Graduação/, /Direito/]
    ],
    "AGRO": [/Agronomia/]
  };

  for (const [courseID, patterns] of Object.entries(courseIDs)){
    if (patterns.some(
      p => Array.isArray(p) 
        ? p.every(r => r.test(campaignName) || r.test(adsetName)) 
        : p.test(campaignName) || p.test(adsetName))
    ){
      return courseID;
    }
  }
  
  return "N/A";
}

// Transforma código do curso no nome do curso
export function getCourseName(courseID: string): string {
  switch (courseID) {
    case "GPC":
      return "Gerente de Pecuária de Corte";
    case "CC":
      return "Ciências Contábeis";
    case "GC":
      return "Gestão Comercial";
    case "ADM":
      return "Administração";
    case "HDIR":
      return "Direito";
    case "GA":
      return "Gestão do Agronegócio";
    case "AGRO":
      return "Agronomia";
    case "SP":
      return "Gestão de Segurança Pública";
    case "BMSC":
      return "MBA Banking e Mercados de Capitais";
    case "GASC":
      return "MBA Gestão Estratégica do Agronegócio";
    case "DHSC":
      return "MBA Direito do Agronegócio e Holding";
    case "CASC":
      return "MBA Contabilidade, Auditoria e Perícia do Agronegócio";
    case "PCSC":
      return "MBA Gestão Estratégica da Pecuária de Corte";
    case "NCSC":
      return "MBA Nutrição e Gestão de Confinamento";
    case "SFSC":
      return "MBA Solo, Fisiologia e Nutrição de Plantas";
    case "GFSC":
      return "MBA Gestão Financeira, Controladoria e Contabilidade no Agronegócio";
    default:
      return "Sem curso definido";
  }
}

export function isPaidTraffic(campaignName: string, adsetName: string): boolean {
  const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Verifica se "trafego" está presente em qualquer uma das strings normalizadas
  return normalize(campaignName).includes("trafego") || normalize(adsetName).includes("trafego");
}
const formatMoney = (props: string | undefined): number => {
  if (!props || props.includes('-')) {
    return 0;
  }
  const replace = props.replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.');
  return parseFloat(replace) || 0;
};

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

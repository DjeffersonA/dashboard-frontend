export const API = async (dataInicio: Date, dataFim: Date): Promise<any[]> => {
  try {
    const parcelaInicio = dataInicio.getMonth();
    const parcelaFim = dataFim.getMonth() + 2;

    let url = `${process.env.NEXT_PUBLIC_API_URL}/ContasAReceber/?data_fim=${dataFim.toISOString().split('T')[0]}&data_inicio=${dataInicio.toISOString().split('T')[0]}&format=json&parcela_fim=12&parcela_inicio=1`;
  
    let allResults: any[] = [];

    do {

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${process.env.NEXT_PUBLIC_API_KEY}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) 
        throw new Error("Erro ao acessar a API");

      const result = await response.json();
      allResults = allResults.concat(result.results);
      url = result.next;
  
    } while (url); 

    return allResults;

  } catch (error) {
    console.error("Erro ao coletar as informações:", error);
    return [];
  }
};

//Apagar após verificação manual das informações com a equipe do Financeiro
export const API2 = async (dataInicio: Date, dataFim: Date): Promise<any[]> => {
  try {
    const parcelaInicio = dataInicio.getMonth();
    const parcelaFim = dataFim.getMonth() + 2;

    let url = `${process.env.NEXT_PUBLIC_API_URL}/ContasAReceber/?import=0&data_fim=${dataFim.toISOString().split('T')[0]}&data_inicio=${dataInicio.toISOString().split('T')[0]}&format=json&parcela_fim=12&parcela_inicio=1`;
  
    let allResults: any[] = [];

    do {

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${process.env.NEXT_PUBLIC_API_KEY}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) 
        throw new Error("Erro ao acessar a API");

      const result = await response.json();
      allResults = allResults.concat(result.results);
      url = result.next;
  
    } while (url); 

    return allResults;

  } catch (error) {
    console.error("Erro ao coletar as informações:", error);
    return [];
  }
};

export const APIContasAPagar = async (dataInicio: Date, dataFim: Date): Promise<any[]> => {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/ContasAPagar/?data_fim=${dataFim.toLocaleDateString('pt-BR').replace(/\//g, '-')}&data_inicio=${dataInicio.toLocaleDateString('pt-BR').replace(/\//g, '-')}&format=json`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${process.env.NEXT_PUBLIC_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) 
      throw new Error("Erro ao acessar a API");
    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Erro ao coletar as informações:", error);
    return [];
  }
};

export const APIMetaAds = async (dataInicio: Date, dataFim: Date): Promise<any[]> => {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/MetaAds/?date_stop=${dataFim.toISOString().split('T')[0]}&date_start=${dataInicio.toISOString().split('T')[0]}&format=json`;

    let allResults: any[] = [];

    do {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${process.env.NEXT_PUBLIC_API_KEY}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) 
        throw new Error("Erro ao acessar a API");

      const result = await response.json();
      allResults = allResults.concat(result.results);
      url = result.next;
  
    } while (url); 

    return allResults;

  } catch (error) {
    console.error("Erro ao coletar as informações:", error);
    return [];
  }
};
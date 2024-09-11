export const API = async (dataInicio: Date, dataFim: Date): Promise<any[]> => {
  try {
    const parcelaInicio = dataInicio.getMonth();
    const parcelaFim = dataFim.getMonth() + 2;

    let url = `${process.env.NEXT_PUBLIC_API_URL}?data_fim=${dataFim.toISOString().split('T')[0]}&data_inicio=${dataInicio.toISOString().split('T')[0]}&format=json&parcela_fim=12&parcela_inicio=1`;
  
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

export const API2 = async (dataInicio: Date, dataFim: Date): Promise<any[]> => {
  try {
    const parcelaInicio = dataInicio.getMonth();
    const parcelaFim = dataFim.getMonth() + 2;

    let url = `${process.env.NEXT_PUBLIC_API_URL}?import=0&data_fim=${dataFim.toISOString().split('T')[0]}&data_inicio=${dataInicio.toISOString().split('T')[0]}&format=json&parcela_fim=12&parcela_inicio=1`;
  
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
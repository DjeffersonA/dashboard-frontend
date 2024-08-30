export const API = async (dataInicio: Date, dataFim: Date): Promise<any[]> => {
  try {
    // Extrair o número do mês de dataInicio e dataFim
    const parcelaInicio = dataInicio.getMonth(); // getMonth() retorna 0 para Janeiro, então somamos 1
    const parcelaFim = dataFim.getMonth() + 2;

    // Montar a URL com os parâmetros de data e parcela
    let url = `${process.env.NEXT_PUBLIC_API_URL}&data_inicio=${dataInicio.toISOString().split('T')[0]}&data_fim=${dataFim.toISOString().split('T')[0]}&parcela_inicio=${parcelaInicio}&parcela_fim=${parcelaFim}`;
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
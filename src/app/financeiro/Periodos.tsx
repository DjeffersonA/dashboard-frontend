async function getFeriados(ano: number): Promise<string[]> {
  const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`);
  const feriadosData = await response.json();

  const feriados = feriadosData
    .filter((feriado: any) => feriado.type === 'national')
    .map((feriado: any) => feriado.date);

  return feriados;
}
  
export async function getPeriodos(ano: number, mes: number): Promise<number[]> {
	const feriados = await getFeriados(ano);
	const diasLimite = [5, 10, 15, 20, 25, 31];
	const diasNoMes = new Date(ano, mes, 0).getDate();
	const periodos: number[] = [];
	let diaInicio = 1;

	function DiaNaoUtil(dia: number): boolean {
	  const data = new Date(ano, mes - 1, dia);
	  const diaSemana = data.getDay();
	  const dataFormatada = data.toISOString().split('T')[0];
	  return diaSemana === 6 || diaSemana === 0 || feriados.includes(dataFormatada);
	}

	for (let i = 0; i < diasLimite.length; i++) {
  	let diaFim = diasLimite[i];

  	if (diaFim > diasNoMes) {
	    diaFim = diasNoMes;
  	}

  	while (DiaNaoUtil(diaFim)) {
    	diaFim += 1;
    	if (diaFim > diasNoMes) {
      	diaFim = diasNoMes;
      	break;
    	}
  	}

  	periodos.push(diaInicio, diaFim);
  	diaInicio = diaFim + 1;
	}

  return periodos;
}
  
export function getIntervalo(dia: number, periodos: number[]): string | null {
  if (dia >= periodos[0] && dia <= periodos[1] ) return 'Dia 05';
  if (dia >= periodos[2] && dia <= periodos[3] ) return 'Dia 10';
  if (dia >= periodos[4] && dia <= periodos[5] ) return 'Dia 15';
  if (dia >= periodos[6] && dia <= periodos[7] ) return 'Dia 20';
  if (dia >= periodos[8] && dia <= periodos[9] ) return 'Dia 25';
  if (dia >= periodos[10] && dia <= periodos[11] ) return 'Dia 30/31';

  return null;
}
  
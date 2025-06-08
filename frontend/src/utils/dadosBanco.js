import axios from 'axios';

async function requestAreas() {
  try {
    const response = await axios.get('http://localhost:8080/api/areas/listar');
    return response;
  } catch (error) {
    console.error('Error: ', error.message);
    throw error;
  }
}

async function obterProgramas() {
  try {
    const response = await requestAreas();
    let dados = response.data;
    
    for (let i = 0; i < dados.length; i++) {
      dados[i] = renomearKey(dados[i], "nome", "label");
      dados[i] = renomearKey(dados[i], "id", "value");
    }
    
    console.log(dados);
    return dados;
  } catch (error) {
    console.error('Error in obterProgramas: ', error.message);
    return [];
  }
}

export { obterProgramas };
import { useState, useEffect } from 'react';
import { enviarDadosCadastro, validarDadosCadastro } from '../utils/cadastro';
import { dadosEntradaCadastro } from '../utils/dadosEntrada';
import CampoEntrada from './CampoEntrada';
import GerarSenha from './GerarSenha';
import axios from 'axios';
import renomearKey from '../utils/renomearKey';

function FormularioCadastro() {
  /*
    Componente de formulário para cadastro de usuários do sistema.
    Renderiza campos de entrada com base nos dados fornecidos.
  */
  const [areas, setAreas] = useState([]);
  const [programas, setProgramas] = useState([]);

  // use effect to get areas
  useEffect(() => {
    /*
      Efeito colateral para buscar áreas disponíveis no sistema.
      Pode ser usado para popular campos de seleção ou dropdowns.
    */
    const fetchAreas = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/areas/listar'
        );
        let dados = response.data;
        for (let i = 0; i < dados.length; i++) {
          dados[i] = renomearKey(dados[i], "nome", "label");
          dados[i] = renomearKey(dados[i], "id", "value");
        }
        setAreas(dados);
      } catch (error) {
        console.error('Erro ao carregar áreas:', error);
      }
    };

    const fetchProgramas = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/programa/listar'
        );
        let dados = response.data;
        for (let i = 0; i < dados.length; i++) {
          dados[i] = renomearKey(dados[i], "nome", "label");
          dados[i] = renomearKey(dados[i], "id", "value");
        }
        setProgramas(dados);
      } catch (error) {
        console.error('Erro ao carregar programas:', error);
      }
    };

    fetchAreas();
    fetchProgramas();
  }, []);
  function handleSubmit(e) {
    /* 
      Manipula o envio do formulário, impedindo o comportamento padrão e processando os dados do formulário.
      @param {Event} e - O evento de envio do formulário.
    */
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const parsedData = validarDadosCadastro(data);
    enviarDadosCadastro(parsedData);
    console.log('Form data log:', parsedData);
  }

  return (
    <>
      <form
        method="post"
        onSubmit={handleSubmit}
        className="formularioCadastro"
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        {dadosEntradaCadastro.map((input, index) => (
          <CampoEntrada
            key={index}
            label={input.label}
            name={input.name}
            placeholder={input.placeholder}
            type={input.type}
            options={input.options}
            required={input.required}
          />
        ))}

        <CampoEntrada
          label="Área de Atuação"
          name="cadastro-area"
          placeholder="Selecione uma área"
          type="select"
          options={areas}
          required={true}
        />
        <CampoEntrada
          label="Programa"
          name="programa-cadastro"
          placeholder="Selecione o programa ao qual faz parte..."
          type="select"
          options={programas}
          required={true}
        />

        <GerarSenha
          onGerar={senha => {
            const senhaInput = document.querySelector(
              'input[name="cadastro-senha"]'
            );
            senhaInput.value = senha;
          }}
        />

        <span className="mini-bold">Campos Obrigatórios (*)</span>
        <button type="submit">Salvar e Continuar</button>
      </form>
    </>
  );
}

export default FormularioCadastro;

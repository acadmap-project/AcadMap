import React, { useState } from 'react';
import dadosEntradaEvento from '../utils/dadosEntrada.js';
import CampoEntrada from './CampoEntrada.jsx';
import { validarDadosEvento, enviarDadosEvento } from '../utils/evento.js';

function FormularioEvento() {
  const [dadosSalvos, setdadosSalvos] = useState(null);
  /*
    Componente de formulário para cadastro de eventos periódicos.
    Renderiza campos de entrada com base nos dados fornecidos.
  */
  function handleSubmit(e) {
    /* 
      Manipula o envio do formulário, impedindo o comportamento padrão e processando os dados do formulário.
      @param {Event} e - O evento de envio do formulário.
    */
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const parsedData = validarDadosEvento(data);
    enviarDadosEvento(parsedData);
    setdadosSalvos(parsedData);
    console.log('Form data log:', parsedData);
  }

  return (
    <>
      {dadosSalvos ? (
        <div
          className="formularioEventoPeriodico"
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          <ul>
            {Object.entries(dadosSalvos).map(([key, value]) => (
              <li style={{ textAlign: 'left' }} key={key}>
                <strong>
                  {dadosEntradaEvento.find(item => item.name === key)?.label ||
                    key}
                  :
                </strong>{' '}
                {value}
              </li>
            ))}
          </ul>
          <button>Calcular classificação do evento</button>
        </div>
      ) : (
        <form
          method="post"
          onSubmit={handleSubmit}
          className="formularioEventoPeriodico"
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          {dadosEntradaEvento.map((input, index) => (
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
          <span className="mini-bold">Campos Obrigatórios (*)</span>
          <button type="submit">Salvar e Continuar</button>
        </form>
      )}
    </>
  );
}

export default FormularioEvento;

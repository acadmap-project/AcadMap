function CampoTexto({ label, name, placeholder, required = false }) {
  /*
        Renderize um campo de texto com rótulo, nome, espaço reservado e opção de obrigatório.
        @param {string} label - O rótulo do campo.
        @param {string} name - O nome do campo.
        @param {string} placeholder - O texto de espaço reservado do campo.
        @param {boolean} required - Indica se o campo é obrigatório.

        Retorna um elemento JSX representando o campo de texto.
    */
  return (
    <>
      <label>{label}</label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        required={required}
      />
    </>
  );
}

function CampoCheckbox({ label, name }) {
  /*
        Renderize um campo de checkbox com rótulo e nome.
        @param {string} label - O rótulo do campo.
        @param {string} name - O nome do campo.

        Retorna um elemento JSX representando o campo de checkbox.
    */
  return (
    <>
      <label>
        {label + '  '}
        <input type="checkbox" name={name} />
      </label>
    </>
  );
}

function CampoSelect({ label, name, placeholder, options }) {
  /* 
        Renderize um campo de seleção com rótulo, nome, espaço reservado e opções.
        @param {string} label - O rótulo do campo.
        @param {string} name - O nome do campo.
        @param {string} placeholder - O texto de espaço reservado do campo.
        @param {Array} options - As opções disponíveis para seleção.

        Retorna um elemento JSX representando o campo de seleção.
    */
  return (
    <>
      <label>{label}</label>
      <select name={name} required defaultValue={placeholder}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}

// Um campo de checkbox que ao clicar apresenta dropdown
function CampoCheckboxDropdown({ label, name, placeholder, options }) {
  /*
        Renderize um campo de checkbox que ao clicar apresenta um dropdown.
        @param {string} label - O rótulo do campo.
        @param {string} name - O nome do campo.
        @param {string} placeholder - O texto de espaço reservado do campo.
        @param {Array} options - As opções disponíveis para seleção no dropdown.

        Retorna um elemento JSX representando o campo de checkbox com dropdown.
    */
  return (
    <>
      <label>
        {label + '  '}
        <div className="dropdown">
          <input type="checkbox" name={name} />
          <select name={`${name}-dropdown`} required>
            {options.map((option, index) => (
              <option
                key={index}
                value={option.value}
                defaultValue={placeholder === option.label ? option.value : ''}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </label>
    </>
  );
}

function CampoEntrada(args) {
  /*
    Renderize um campo de entrada com base no tipo especificado.
    @param {Object} args - Argumentos contendo propriedades do campo.

    Retorna um elemento JSX representando o campo de entrada.
    */
  return (
    <>
      {args.type === 'checkbox' ? (
        <CampoCheckbox label={args.label} name={args.name} />
      ) : args.type === 'select' ? (
        <CampoSelect
          label={args.label}
          name={args.name}
          options={args.options}
        />
      ) : args.type === 'checkbox-dropdown' ? (
        <CampoCheckboxDropdown
          label={args.label}
          name={args.name}
          placeholder={args.placeholder}
          options={args.options}
        />
      ) : (
        <CampoTexto
          label={args.label}
          name={args.name}
          placeholder={args.placeholder}
          required={args.required}
        />
      )}
    </>
  );
}

export default CampoEntrada;

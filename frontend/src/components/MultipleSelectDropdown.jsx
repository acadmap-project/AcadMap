import { useEffect, useState, useRef } from 'react';
import closeIcon from '../assets/close.svg';

const removeAccents = str => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const MultiSelectDropdown = ({ options, value = [], onChange }) => {
  const [searchText, setSearchText] = useState('');
  const [filterOptions, setFilterOptions] = useState(options);
  const [active, setActive] = useState(false);
  const selectref = useRef(null);

  const setOption = val => {
    let newValue;
    if (value.includes(val)) {
      newValue = value.filter(item => item !== val);
    } else {
      newValue = [...value, val];
    }
    onChange(newValue);
  };

  useEffect(() => {
    if (!searchText || searchText.trim() === '') {
      setFilterOptions(options);
    } else {
      const match = options.filter(item =>
        removeAccents(item?.label.toLowerCase()).includes(
          removeAccents(searchText.toLowerCase())
        )
      );
      setFilterOptions(match);
    }
  }, [searchText, options]);

  useEffect(() => {
    const closeHandler = event => {
      if (
        selectref.current &&
        !event.composedPath().includes(selectref.current)
      ) {
        setActive(false);
      }
    };
    document.addEventListener('click', closeHandler);
    return () => {
      document.removeEventListener('click', closeHandler);
    };
  }, []);

  const deleteItem = optValue => {
    const newValue = value.filter(item => item !== optValue);
    onChange(newValue);
  };

  return (
    <div className="relative border border-gray-200 rounded-md" ref={selectref}>
      <div className="px-2">
        {value && value.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center text-xs">
            {value.map(opt => {
              const option = options.find(option => option.value === opt);
              return (
                <span
                  key={opt}
                  className="flex items-center px-2 my-1.5 rounded-md bg-gray-200"
                >
                  {option ? option.label : opt}
                  <div
                    className="cursor-pointer hover:text-red-500 ml-1"
                    onClick={e => {
                      e.stopPropagation();
                      deleteItem(opt);
                    }}
                  >
                    <img src={closeIcon} alt="close" className="w-3 h-3" />
                  </div>
                </span>
              );
            })}
          </div>
        )}
        <input
          type="text"
          placeholder="Digite para buscar..."
          className="px-4 py-2 w-full"
          onClick={() => setActive(true)}
          onChange={e => setSearchText(e.target.value)}
          value={searchText}
        />
      </div>
      {active && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg flex flex-col gap-2 py-4 max-h-[300px] overflow-y-auto">
          {filterOptions.length > 0 ? (
            filterOptions.map(option => (
              <div
                key={option.value}
                className="flex items-center gap-2 hover:bg-gray-200 cursor-pointer p-2"
                onClick={() => setOption(option.value)}
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  onChange={() => setOption(option.value)}
                  readOnly={false}
                />
                {option.label}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500 text-center">
              Nenhuma opção encontrada
            </div>
          )}
        </div>
      )}
    </div>
  );
};

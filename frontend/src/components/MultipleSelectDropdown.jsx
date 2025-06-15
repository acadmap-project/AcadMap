import { useEffect, useState, useRef } from 'react';

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
    const match = options.filter(item =>
      item?.value.toLowerCase().includes(searchText?.toLowerCase())
    );
    setFilterOptions(match.length ? match : options);
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

  return (
    <div className="relative border border-gray-200 rounded-md" ref={selectref}>
      <div className="px-2">
        {value && value.length > 0 && (
          <div className="flex gap-2 items-center text-xs">
            {value.map(opt => {
              const option = options.find(option => option.value === opt);
              return (
                <span key={opt} className="px-2 rounded-md bg-gray-200">
                  {option ? option.label : opt}
                </span>
              );
            })}
          </div>
        )}
        <input
          type="text"
          placeholder="search"
          className="px-4 py-2 w-full"
          onClick={() => setActive(true)}
          onChange={e => setSearchText(e.target.value)}
        />
      </div>
      {active && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg flex flex-col gap-2 py-4 max-h-[300px] overflow-y-auto">
          {filterOptions.map(option => (
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
          ))}
        </div>
      )}
    </div>
  );
};

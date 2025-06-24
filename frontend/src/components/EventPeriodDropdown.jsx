import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function EventPeriodDropdown() {
  /* 
    Dropdown para cadastrar eventos e periódicos.
    Exibe um botão que, ao ser clicado, mostra um menu com opções para cadastrar
    eventos e periódicos. O menu fecha ao clicar fora dele.
    */
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="block py-2 px-3 text-black bg-white border border-black rounded-none hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(prev => !prev)}
      >
        Cadastrar Publicação
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-50">
          <Link
            to="/cadastro-evento"
            className="block px-4 py-2 text-black hover:bg-gray-100"
            onClick={() => setOpen(false)}
            aria-current="page"
          >
            Evento
          </Link>
          <Link
            to="/cadastro-periodico"
            className="block px-4 py-2 text-black hover:bg-gray-100"
            onClick={() => setOpen(false)}
            aria-current="page"
          >
            Periódico
          </Link>
        </div>
      )}
    </div>
  );
}

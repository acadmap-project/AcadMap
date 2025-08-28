import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dropIcon from '../assets/drop.svg';

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
      <div
        className="block py-2 px-3 btn btn-outline"
        onClick={() => setOpen(prev => !prev)}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(prev => !prev);
          }
        }}
      >
        <span className="flex items-center gap-2">
          Cadastrar Eventos/Periódicos
          <img src={dropIcon} alt="dropdown" className="w-6 h-6" />
        </span>
      </div>
      {open && (
        <div className="absolute left-0 w-4/5">
          <Link
            to="/cadastro-evento"
            className="px-4 py-2 min-w-full btn btn-outline rounded-none"
            onClick={() => setOpen(false)}
            aria-current="page"
          >
            Cadastrar Eventos
          </Link>
          <Link
            to="/cadastro-periodico"
            className="block px-4 py-2 btn btn-outline rounded-none"
            onClick={() => setOpen(false)}
            aria-current="page"
          >
            Cadastrar Periódicos
          </Link>
        </div>
      )}
    </div>
  );
}

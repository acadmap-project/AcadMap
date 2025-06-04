import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>A pagina que você procura não existe.</p>
      <Link to="/">Voltar para HOME</Link>
    </div>
  );
};

export default NotFound;

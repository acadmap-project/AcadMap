function gerarSenha(tamanho = 12) {
  const caracteres =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
  let senha = '';
  for (let i = 0; i < tamanho; i++) {
    senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return senha;
}

export default function GerarSenha({ onGerar }) {
  return (
    <button
      type="button"
      onClick={() => onGerar(gerarSenha())}
      className="w-full btn btn-neutral"
      title="Gerar Senha Automaticamente"
    >
      ⟳
    </button>
  );
}

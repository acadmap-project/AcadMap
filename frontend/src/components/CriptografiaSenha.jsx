import CryptoJS from 'crypto-js';

export function criptografarSenha(senha) {
  /*
    Esta função recebe uma senha como entrada e retorna a senha criptografada usando o algoritmo SHA-256.
    */
  return CryptoJS.SHA256(senha).toString(CryptoJS.enc.Hex);
}

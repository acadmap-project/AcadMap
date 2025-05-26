# AcadMap - FRONTEND
## Configuração do Ambiente

Explicação de como fazer a configuração do ambiente de desenvolvimento para a equipe de frontend

Instale o nvm e verifique se ele está funcionando verificando a versão com `nvm -v`
``` bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
nvm -v
```
Para o comando acima funcionar você precisa ter o **curl** instalado. No windows e mac se instala o nvm de outra forma.

Instale e use o node v18
```bash
nvm install v18
nvm use v18
node -v
```

Com isso, já e possível fazer o clone do repo, entrar na pasta frontend e instalar o necessário e rodar a versão dev.
```bash
git clone https://github.com/SainyGb/AcadMap.git 
cd AcadMap/frontend
npm install
npm run dev
```
Após o **npm run dev** já é possível ver o link para acessar no terminal.

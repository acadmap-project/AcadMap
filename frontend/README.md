# AcadMap - FRONTEND
## Configuração do Ambiente

Explicação de como fazer a configuração do ambiente de desenvolvimento para a equipe de frontend

Instale o nvm e verifique se ele está funcionando verificando a versão com `nvm -v`
``` bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
nvm -v
```
Para o comando acima funcionar você precisa ter o **curl** instalado. No windows e mac se instala o nvm de outra forma.

Instale e use o node v22
```bash
nvm install v22
nvm use v22
node -v
```

Com isso, já e possível fazer o clone do repo, entrar na pasta frontend e instalar o necessário e rodar a versão dev.
```bash
git clone https://github.com/SainyGb/AcadMap.git 
cd AcadMap/frontend
npm install 
npm run prepare
npm run lint
npm run format:check
npm run dev
```

* npm install : instala as bibliotecas necessarias
* npm run prepare : faz a iniciação do husky para automatizar pre comitts evitando codigos nao desejados
* npm run lint : faz o lint para verificar se tudo esta como o desejado
* npm run format:check : faz a verificação da formatação para verificar se esta como o esperado
* npm run dev : roda a aplicação frontend

Após o **npm run dev** já é possível ver o link para acessar no terminal.
## Usando prettier e eslint

Para garantir que o código esteja formatado corretamente foi usado o prettier e eslint.
Para rodar basta executar os comandos ja definidos no package.json
```bash
npm run lint
npm run format:check
```
O npm run lint vai verificar se o código está de acordo com as regras do eslint, e o npm run format:check vai verificar se o código está formatado de acordo com as regras do prettier. Ambos somente irão apontar onde estão os problemas, mas não irão corrigir.
## Evitando Problemas Utilizando Docker

Para evitar problemas do frontend não estar executando em diferentes maquinas, foi feita conteirização com Docker.

[Recomendo instalar o docker na sua maquina](https://www.docker.com/)

***ANTES DO PULL REQUEST, TENTE EXECUTAR COM DOCKER PARA GARANTIR QUE TUDO ESTA EXECUTANDO COMO O ESPERADO***

Para utilizar o docker, entre no diretório frontend e execute os comandos abaixo.
```bash
docker build -t front .
docker run -p 5173:5173 front
```

O primeiro comando acima faz o build do codigo do front.

O segundo comando faz o run da imagem gerada pelo build, fornecendo no terminal o link para acessar o frontend.
## Informação Sobre a Estrutura de Diretórios

No frontend, existe uma estrutura de pastas bem definidas para garantir que tudo esteja onde se espera. Abaixo está informado o que cada diretório serve.

* **/public/** : Aqui fica dados de reconhecimento público para o navegador. De forma simplificada, o arquivo **favicon.ico** e o arquivo **robots.txt**
* **/src/** : Aqui fica armazenado o código fonte do projeto frontend, todas as adições e alterações devem correr aqui dentro. Alterações fora do **src** são alterações sobre arquivos de configurações e nada alem disso.
* **/src/assets/** : Neste diretório ficam armazenadas as imagens estáticas como imagens e svg.
* **/src/components/** : Neste diretório ficam armazenados os componentes React produzidos.
* **/src/pages/** : Aqui fica armazenado os componentes a nivel de página, para utilização de routing
* **/src/hooks/** : Aqui fica armazenado os hooks produzidos
* **/src/utils/** : Aqui fica armazenado as funções internas e arquivos de auxílio
* **/src/styles** : Aqui fica armazenado os arquivos .css e outros arquivos para a estilização web. 


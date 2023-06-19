## Configuração necessária

- NodeJs (versão 18 ou superior)
- NPM (versão 8.19 ou superior)

**Obs.**: Recomendamos o uso do [NVM](https://github.com/nvm-sh/nvm) para realizar a instalação do NodeJs+NPM

## Passo-a-passo

- Clone o repositório em sua máquina
<!-- - Dentro da pasta do repositório, crie um arquivo `.env` com os valores corretos -->
- Dentro da pasta do repositório, execute: `npm install` e aguarde instalar as dependências
- Em seguida, execute `npm build` para gerar uma versão de produção do projeto
- Por fim, execute `npm start` para executar o projeto em sua versão final, este mesmo comando será usado na configuração de deploy
- Para acessar aplicação, abra algum navegador no endereço `http://localhost:3000/login`

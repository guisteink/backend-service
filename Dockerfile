# Instala a imagem Node.js na minha imagem!
FROM node:18.12.1-alpine3.16

# define o diretório de trabalho para qualquer comando RUN, CMD, COPY
# os arquivos que colocamos no contêiner do Docker executando o servidor estarão em:
WORKDIR /usr/src

# Copia package.json, package-lock.json, .env para a raiz de WORKDIR
COPY ["package.json", "package-lock.json", "./"]

# Copia tudo do diretório src para WORKDIR/src
COPY ./src ./src

# Instala todos os pacotes no container
RUN npm install

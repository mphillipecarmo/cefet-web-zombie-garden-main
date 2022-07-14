# define esta imagem a partir da oficial do MySQL
# imagem: https://hub.docker.com/_/mysql
FROM mysql:8.0.26

# copia os arquivos que criam o banco e o populam do host para o container
# a imagem oficial do MySQL executa todos os arquivos .sh, .sql e .sql.gz que
# estão na pasta /docker-entrypoint-initdb.d. Executa-os em ordem alfabética
COPY ./db-migrations/ /docker-entrypoint-initdb.d/

# configura usuário e senhas de acesso ao banco
ENV MYSQL_ROOT_PASSWORD=123456
ENV MYSQL_DATABASE=zombies


# sugere que container seja executado com -p 3306:3306
EXPOSE 3306

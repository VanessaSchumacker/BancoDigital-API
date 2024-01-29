create database dindin;

create table usuarios (
  id serial primary key,
  nome text not null,
  email text not null,
  senha text not null
);

/* OBS: Crie a tabela categoria antes da transacoes*/
create table transacoes (
  id serial primary key,
  descricao text not null,
  valor integer not null, 
  data date,
  categoria_id integer references categoria(id),
  usuario_id integer references usuarios(id),
  tipo text not null
 );

 create table categoria(
  id serial primary key,
  descricao text not null
 );
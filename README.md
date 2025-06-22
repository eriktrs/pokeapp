# Pokémon App

[![en](https://img.shields.io/badge/lang-en-blue.svg)](https://github.com/eriktrs/pokeapp/blob/main/README.en.md)

> 🇧🇷 Versão em Português

Este projeto foi desenvolvido como parte de um desafio técnico que trata-se de um aplicativo construído com **Ionic e Angular**, que consome a [PokeAPI](https://pokeapi.co) e apresenta uma listagem de Pokémons com suas informações e detalhes.

## 🚀 Abordagem e Estilo de Codificação

- Foi adotado uma arquitetura modular, separando **componentes**, **serviços** e **rotas**, facilitando a manutenção e escalabilidade.
- O projeto usa **injeção de dependência Angular** para gerenciar serviços e chamadas HTTP.
- Para manter o código limpo e legível, foi utilizado **TypeScript estrito**, com bastante uso de tipagens e interfaces para os modelos de dados.
- Os commits foram feitos de forma **frequente e descritiva**, seguindo as boas práticas do Git.
- A listagem principal dos Pokémons conta com sistema de **paginação**, garantindo melhor usabilidade e desempenho.
- O projeto possui uma funcionalidade de **favoritos**, permitindo ao usuário marcar/desmarcar Pokémons, com persistência em `localStorage`.
- A interface foi desenvolvida de maneira que seja **responsiva**, adequada para diferentes tamanhos de tela e orientações (retrato/paisagem).
- Os testes unitários foram criados para testar **componentes**, **serviços** e **rotas**, utilizando **Jasmine/Karma**.
- O layout foi pensado para ser funcional e organizado, com uso do **Ionic Components** e **Flexbox/Grid** para melhor alinhamento.
- A navegação foi construída através do **Angular Router**, garantindo uma transição fluida entre listagem e tela de detalhes.

## 📋 Requisitos para execução

Antes de rodar este projeto, você precisa ter os seguintes requisitos instalados na sua máquina:

- [Node.js](https://nodejs.org/) (versão 16.x ou superior recomendada)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/) (gerenciador de pacotes)
- [Ionic CLI](https://ionicframework.com/docs/cli) (para rodar e construir o app)

## 🚀 Como executar o projeto

Clone o repositório:

```bash
git clone https://github.com/eriktrs/pokeapp
cd pokeapp
```

Instale as dependências:

```bash
npm install
```

Execute o app:

```bash
ionic serve
```

## 🗺️ Como navegar na página

Na tela principal, o usuário irá identificar com os seguintes recursos.

- A tela possui uma aba demonstrando os Pokemóns disponíveis naquela página e uma aba de favoritos
- O cartão contém apenas o nome do Pokemón
- O cartão possui a opção de favoritar o Pokemón sendo representado por uma estrela
- Ao clicar na imagem do Pokemón ela irá redirecionar para a página de detalhes daquele Pokémon

Ao entrar na tela de detalhes, o usuário irá ter acesso as seguintes informações:

- Nome do Pokemón
- Número da Pokedex do Pokemón
- Atributos físicos como altura e peso
- Habilidades
- Status de combate
- Golpes que o Pokemón pode ter
- Imagens relacionadas a aquele Pokemón
- Cadeia de evoluções

## 🧪 Testes

Para rodar os testes unitários:

```bash
npx ng test
```

---

## 📣 Contato

Sinta-se à vontade para abrir uma issue ou pull request se quiser contribuir ou relatar algum problema.

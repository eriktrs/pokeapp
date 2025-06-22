# Pokémon App

[![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](https://github.com/eriktrs/pokeapp/blob/main/README.md)

> 🇪️n English version

This project was developed as part of a technical challenge. It is an application built with **Ionic and Angular**, which consumes the [PokeAPI](https://pokeapi.co) and displays a list of Pokémon with their information and details.

## 🚀 Approach and Coding Style

- A **modular architecture** was adopted, separating **components**, **services**, and **routes** to make the codebase easy to maintain and scalable.  
- The project uses **Angular's dependency injection** to manage services and HTTP requests.  
- **Strict TypeScript** was used to ensure clean and readable code, with typings and interfaces for data models.  
- **Frequent and descriptive commits** were made, following Git best practices.  
- The main Pokémon list features **pagination**, providing better usability and performance.  
- A **favorites** feature allows users to mark/unmark Pokémon, with persistence in `localStorage`.  
- The interface was designed to be **responsive**, working well on different screen sizes and orientations (portrait/landscape).  
- **Unit tests** were created to cover **components**, **services**, and **routes**, using **Jasmine/Karma**.  
- The layout is functional and organized, using **Ionic Components** and **Flexbox/Grid** for alignment.  
- Navigation was built using **Angular Router**, ensuring smooth transitions between list and detail pages.

## 📋 Requirements to run

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (recommended version 16.x or higher)
- [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) (package manager)
- [Ionic CLI](https://ionicframework.com/docs/cli) (to run and build the app)

## 🚀 How to run

Clone the repository:

```bash
git clone https://github.com/eriktrs/pokeapp
cd pokeapp
```

Install the dependencies:

```bash
npm install
```

Run the app:

```bash
ionic serve
```

## 🗺️ How to Navigate the Page

On the main screen, the user will find the following features:

- The screen has a tab showing the Pokémons available on that page and a favorites tab.
- Each card displays only the Pokémon's name.
- The card has an option to favorite the Pokémon, represented by a star.
- Clicking on the Pokémon's image will redirect to that Pokémon’s detail page.

On the details screen, the user will have access to the following information:

- Pokémon name
- Pokémon’s Pokédex number
- Physical attributes such as height and weight
- Abilities
- Combat stats
- Moves that the Pokémon can learn
- Images related to that Pokémon
- Evolution chain

## 🧪 Tests

To run unit tests:

```bash
npx ng test
```

## 📣 Contact

Feel free to open an issue or pull request if you'd like to contribute or report any issues.

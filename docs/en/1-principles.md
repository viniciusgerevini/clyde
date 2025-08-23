<!--
nav_max: 1
-->
# Principles

## 📝 Simple to write; As close to regular writing as possible

As much as possible, Clyde tries to get out of your way.

First of all, most "special" symbols, are not characters you use very often when writing text, so you don't need to fight the syntax when writing your dialogue.

Second, Clyde is smart about when a symbol is meant to be special. For example, `->` is used to define a divert, and `*`, `+` are used to define options. They are expected to be the first item in a line, so Clyde knows if you find them mid sentence, they are just regular text. 

> Read the room!! Those -> * + are not special charaters!!

## 📜 File as the source of truth; No extra databases or random data is created during parsing

This is important for maintainability. You don't need to keep extra files hanging around, or some system behind a login. Your `.clyde` files is all you need to replicate your dialogue anywhere.

## 🎛️ Simple API; Dialogue focused

Clyde is not as feature-rich as other dialogue solutions when it comes to interfaces and management. Being simple makes it less opinionated about how to be used, allowing it to fit different scenarios, game structures and genres.

The trade-off is that it might look a little bit daunting for someone getting started. To mitigate that, the plugins usually come with a set of helpers and examples to help you get started.

## 🌎 Localisation in mind

Localisation is an important step to reach a wider audience, and Clyde has it as a requirement for every new feature.


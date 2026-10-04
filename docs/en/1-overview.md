<!--
nav_max: 2
custom_page_class: getting-started-page
-->
# Getting started

## What's in the box?

![Icon Language](../../assets/images/icon_language_line.svg)
A language designed to be easy to write and read.

![Icon Godot](../../assets/images/icon_godot_line_only.svg)
A plugin for the Godot game engine, which adds syntax highlighting, instant error feedback, a player for easy iteration, and a set of helpers and samples to help you get started.

![Icon Language Server](../../assets/images/icon_language_server_line.svg)
If you rather use your own editor, there is a language server which provides syntax highlighting, navigation support, auto complete and more.

![Icon Tools](../../assets/images/icon_tools_line.svg)
There is also a standalone player and a CLI tool you can use to execute your dialogue files.


## Principles

The clyde ecosystem includes the Clyde Language and a set of tools to help writing dialogues in a way that feels natural and straight forward. This is achieved by sticking to a set of principles:

### 📝 As close to regular writing as possible

Text based dialogue systems tend to become similar to programming languages, with lots of special characters and noisy syntax. This makes it harder to write and navigate them, specially for people not used to programming languages.

Clyde's design aims to be clean and flexible. It avoids reserving symbols commonly used in writing, and, for the cases it needs special characters, it understands the context to avoid unnecessary workarounds. 

Here is an example: `->` is a divert symbol used to go to a certain position in the dialogue file. However, if used mid sentence, like this:

```clyde
Read the room!! Those -> are not special charaters!!

```

The interpreter is smart enough to known that in this context these characters were not meant to be a divert. This allows for a more enjoyable writing, as you don't need to keep fighting the syntax checker.

### 📜 File as the source of truth

Clyde does not require extra databases to store metadata, and no extra data is created during parsing. This ensures that what you see in the dialogue file is all you need to replicate it anywhere.

This is also intended to give you freedom to pick the best tool for you. Any text editor can be used to edit the file, any interpreter implementation can execute it, and in the event you decide to switch to another dialogue solution, all your dialogues are plain text files which should make them easier to migrate.

### 🎛️ Simple API and dialogue isolation

The interpreters focus on dialogue execution. It exposes a simple API to retrieve the next content, choose branches, and provide a few ways to communicate data between game and dialogue. You are responsible for wiring the UI and decide where to source data from.

I believe this design is beneficial in the long run as game and dialogue can evolve at their own pace. This contributes to a flexible solution that is easy to maintain, and can be reused in various scenarios.

To mitigate the friction this may cause, there are various tools, helpers, guides, and sample code to help you get started. You can find anything you need by browsing these docs.

### 🌎 Localization in mind

Localisation is an important step to reach wider audiences. This is one of the main considerations every time a new feature is developed. How does it impact translation? Does it encourage bad practices?

At the moment, Clyde follows a very simplistic approach for localization (key/value support). That's enough for most cases, but in the future I intend to expand support to more elegant solutions that support things like pluralization.

## Where to start?

- If you are looking for examples, or a specific topic, check the [guides](./5-guides/) pages.
- If you'd like to familiarise with the language, the [reference](./2-language/) page describes everything it can do.
- Check the [Godot Plugin](./3-godot/) page for installation and usage guide.
- For all the other amazing tools, check the [tools](./4-tools/) section.


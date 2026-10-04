<!--
  nav_max: 1
-->
# Language Server

>WARNING This is a fairly new implementation. Please report any bugs or improvement suggestions.

Clyde's language server implements the Language Server Protocol ([LSP](https://langserver.org/)) for Clyde, so you can have great authoring and refactoring features in your editor of choice.

- Real-time and accurate syntax highlighting
- Diagnostics (get wrong syntax feedback while writing your dialogues)
- Autocomplete (block names, speakers, linked files, ...)
- Go to definition (Go to blocks definitions and linked files)
- Rename support (renaming speakers, blocks and tags, updating every occurrence in the file)


## Instalation

The current language server version is implemented in Node and can be installed either via `npm` or the OS specific binary. 

### Via NPM

```sh

npm install -g @clyde-lang/ls


```

### Installing OS specific binary

You can download the platform specific binary (no need to have node installed) for your operational system from the repository's [releases page](https://github.com/viniciusgerevini/clyde-js/releases).

Direct download links for latest version:

- [Linux](https://github.com/viniciusgerevini/clyde-js/releases/latest/download/clydels-linux.zip)
- [MacOS](https://github.com/viniciusgerevini/clyde-js/releases/latest/download/clydels-macos.zip)
- [Windows](https://github.com/viniciusgerevini/clyde-js/releases/latest/download/clydels-win-x64.zip)

If the link above doesn't work, look for the correct zip file in the [release page](https://github.com/viniciusgerevini/clyde-js/releases/latest).

_Note: MacOS blocks self-signed apps from running. You are likely to get a warning and be blocked when trying to run the language server for the first time. To allow the binary you can either go to "Privacy & Security" and allow it to run, or execute a command like this in your terminal: `spctl --add <path to clydels>`_


## Configuration

### Server configuration

Some server configurations can be changed via arguments when starting the service:

| Property                   | Description |
| ----------------------- | ----------- |
| `--parse-debounce-time <number>` | Parsing is debounced while the user types to improve performance. The default wait time is a conservative 300ms. You can use this option to set whatever value you prefer, in milliseconds.|
| `--log-level <number>` | The log level to print to the log file. Disabled: 0 (default). Error:1  Info: 2. Debug: 3. |
| `--log-file <path>` | A path to store logs from the server when log is enabled |

### Project specific configuration

You can set configurations for your project by creating a `clyde.config.json` in your project root.

Configuration example:

```javascript
{
  // Default folder where the server will look for `.clyde` files when only
  // the file name is referenced
  "defaultFolder": "dialogues/"
}

```

## Usage

Given the variety of editors out there, explaining how to configure them is out of scope. Look for LSP related documentation for your editor of choice.

### VSCode

For VS Code, you do not need to install the language server as it's already included with the [plugin](https://marketplace.visualstudio.com/items?itemName=viniciusgerevini.clyde-dialogue-language-vscode)


### Neovim

For Neovim, you can install the [clyde.vim](https://github.com/viniciusgerevini/clyde.vim) plugin to enabled the filetype recognition and comment symbol configuration.

After that, configure the LSP the way you usually do. Here is a Neovim native example:

```lua

vim.lsp.config("clyde", {
  cmd = { "clydels", "--stdio" },
  filetypes = { 'clyde' },
  root_markers = { '.git', 'clyde.config.json' },
})

vim.lsp.enable('clyde')


```

If you use Mason or the lspconfig plugin, unfortunately you won't find a configuration for Clyde. It's required a certain number of stars on github or plugin downloads to be eligible to be included in those configs. If you are interested, you can help by starring the [language server repository](https://github.com/viniciusgerevini/clyde-js), or downloading the VSCode plugin to increase usage. I will register the config as soon I'm allowed to.


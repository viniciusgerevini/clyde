# Node Libraries

Besides the two Node libraries mentioned before ([CLI](./3-cli.md) and [Language Server](./1-language-server.md)), there is a parser and interpreter implementation for Node / JS.

Here is an example:

```javascript
import { parse } from "@clyde-lang/parser";
import { Interpreter } from "@clyde-lang/interpreter";

const content = parse(`

Hagrid: Yer a wizard, Harry!
Harry: I'm a what?
    * Hagrid: A wizard, Harry!
    * Hagrid: Yer a wizard!

    `);

    const dialogue = Interpreter(content);

    dialogue.getContent();

    //respone: { type: 'line', text: 'Yer a wizard, Harry!', speaker: 'Hagrid }

    dialogue.getContent();

    // response:
    // {
    //     type: 'options',
    //     name: "I'm a what?",
    //     speaker: 'Harry',
    //     options: [
    //         { text: 'A wizard, Harry!' },
    //         { text: 'Yer a wizard!' }
    //     ]
    // }

    dialogue.choose(1);

    dialogue.getContent();

    // response: { type: 'line', text: 'Yer a wizard', speaker: 'Hagrid }`
`)

```

For more details, installation and usage, check the [Clyde JS repository](https://github.com/viniciusgerevini/clyde-js).

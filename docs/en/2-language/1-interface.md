# Interpreter's interface

Even though this document is focused on the language itself, I think it's a good idea to start by covering the basic interpreter's contract. I'll use the GDScript implementation for reference.

```gdscript
# initialize the dialogue object
var dialogue = ClydeDialogue.new()

# load a dialogue file
dialogue.load_dialogue('my_dialogue')

# listen to events triggered
dialogue.event_triggered.connect(_on_event_triggered)

# listen to internal variable changes
dialogue.variable_changed.connect(_on_variable_changed)

# setup external variable proxies. This will allow the dialogue to
# access external variables and update them
dialogue.on_external_variable_fetch(_on_external_variable_fetch)
dialogue.on_external_variable_update(_on_external_variable_update)

# Call get content to return the next dialogue line
dialogue.get_content()

# When the current dialogue line is a branch (options),
# you can call this method to choose one of them
dialogue.choose(index)
```

The main methods used are `get_content()` and `choose(int)`.

`get_content()` returns the next dialogue line. It may return one of the following types:

**line**: A simple dialogue line.
```javascript
{ type: 'line', speaker: 'Captain', text: 'Ahoy!', id: '123', tags: ["happy"] }
```

**options**: A list with options or topics the player may choose from (branches).
```javascript
{
    type: 'options',
    text: 'What do you want to talk about?',
    speaker: 'NPC',
    options: [{ text: 'Life' }, { text: 'The Universe' }, { text: 'Everything else' }]
}
```

When `options` are available, you can choose one of them by passing its index to the dialogue object. Option's index starts from 0:

```javascript
dialogue.choose(0);
```

When in an options state, any subsequent call to `get_content()` will return the same options object, until a choice is made.

**end**: This means the dialogue has reached an end. Any subsequent call to `get_content` will return an end object.
```javascript
{ type: 'end' }
```

Currently there are two interpreter implementations: a [JavaScript version](https://github.com/viniciusgerevini/clyde-js), and a [Godot's GDScript version](https://github.com/viniciusgerevini/godot-clyde-dialogue). Check the respective links for more details on how to use them. They expose similar interfaces, but there are some differences due to language standards and how each engine handles events and localisation.


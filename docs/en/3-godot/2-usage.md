<!--
nav_max: 2
custom_page_class: lang_ref
-->
# Usage

In the sections bellow, it's described in detail each step to run the dialogue.

Here is a simple implementation for reference:

```gdscript

var _dialogue

# this represents your persistence logic. In this example, it keeps it in memory
var _external_persistence = {}
var _dialogue_internal_data_persistence = {}

func _ready():
  # Setting up your dialogue
  _dialogue = ClydeDialogue.new()
  dialogue.load_dialogue('my_dialogue_file')

  # listen to events to react to them
  _dialogue.event_triggered.connect(_on_event_triggered)

  # load any previous data. This object is opaque.
  # it holds internal dialogue data, like access memory and random selections
  dialogue.load_data(_dialogue_internal_data_persistence);

  # configure the data access so your dialogue
  # can access and update external data
  _dialogue.on_external_variable_fetch(_on_external_variable_fetch)
  _dialogue.on_external_variable_update(_on_external_variable_update)


# this method will be triggered by a user interaction (button, click, key press)
func _get_next_dialogue_line():
  var content = _dialogue.get_content()
  if content.type == "end":
    # persisting dialogue access data
    _dialogue_internal_data_persistence = _dialogue.get_data()
    # do other stuff like hiding the interface, resuming inputs, ...
    return

  if content.type == 'line':
    # Show dialogue line to player
    # ...

  if content.type == 'options':
    # display options for player to choose from
    # ...


# this will be called when player selects an option
func _on_option_selected(index):
  _dialogue.choose(index)
  _get_next_dialogue_line()


func _on_event_triggered(event_name, parameters):
  print("Event received: %s params: %s " % [event_name, parameters])


func _on_restart_pressed():
  _dialogue.start()
  _get_next_dialogue_line()


# this is an example on how to provide access to external variables.
# For example, if the dialogue tries to access { @health }, this method will be called and return the value from
# _external_persistence["health"]
func _on_external_variable_fetch(variable_name: String):
  return _external_persistence[variable_name]


# This method is called when the dialogue tries to set an external variable. i.e { set @health = 10 }
func _on_external_variable_update(variable_name: String, value: Variant):
  _external_persistence[variable_name] = value


```

You can find and execute the complete example on the [examples folder](https://github.com/viniciusgerevini/godot-clyde-dialogue/tree/godot_4/addons/clyde/examples).

## Creating an object

You need to instantiate a `ClydeDialogue` object.

``` gdscript
var dialogue = ClydeDialogue.new()
```


## Loading dialogues

The interpreter supports loading parsed JSON files, as well as `.clyde` files imported in the project.

When only the file name is provided, the interpreter will look into the default folder defined on `Project > Project Settings > Dialogue > Source Folder`.

``` gdscript
dialogue.load_dialogue('my_dialogue')
# or
dialogue.load_dialogue('res://dialogues/my_dialogue.clyde')
# or
dialogue.load_dialogue('res://dialogues/my_dialogue.json')
```

As you can have more than one dialogue defined in a file through blocks, you can provide the block name to be used.
``` gdscript
dialogue.load_dialogue('level_001', 'first_dialogue')
```

## Starting / Restarting a dialogue

You can use `dialogue.start()` at any time to restart a dialogue or start a different block.

``` gdscript
# starts default dialogue
dialogue.start()

# starts a different block
dialogue.start('block_name')
```
Restarting a dialogue won't reset the variables already set.


## Getting next content

You should use `dialogue.get_content()` to get the next available content.

This method may return one of the following values:

### Line

A dialogue line (`Dictionary`).

```gdscript
{
  "type": "line",
  "text": "Ahoy!",
  "speaker": "Captain", # optional
  "id": "123", # optional
  "tags": ["happy"] # optional
}
```

### Options

Options list with options/topics the player may choose from (`Dictionary`).

```gdscript
{
  "type": "options",
  "name": "What do you want to talk about?", # optional
  "speaker": "NPC", # optional
  "options": [
    {
    "label": "option display text",
    "speaker": "NPC", # optional
    "id": "abc", # optional
    "tags": [ "some_tag" ], # optional
    },
    ...
  ]
}
```

### End

Returned when the dialogue reached its end. Any new subsequent call will return an end object.

```gdscript
{ "type": "end" }
```

## Listening to variable changes

You can listen to variable changes by observing the `variable_changed` signal.

``` gdscript
  # ...

  dialogue.variable_changed.connect(func (variable_name, value, previous_value):
    if variable_name == 'hp' and value < previous_value:
      print('damage taken')
  )
```

## Listening to events

You can listen to events triggered by the dialogue by observing the `event_triggered` signal.

``` gdscript
  # ...

  dialogue.event_triggered.connect(func (event_name, parameters):
    if event_name == 'self_destruction_activated':
      _shake_screen()
      _play_explosion()
  )
```

## Data persistence

To be able to use variations, single-use options and internal variables properly, you need to persist the dialogue data after each execution.

If you create a new `ClydeDialogue` without doing it so, the interpreter will show the dialogue as if it was the first time it was run.

You can use `dialogue.get_data()` to retrieve all internal data, and then later use `dialogue.load_data(data)` to re-populate the internal memory.


Here is a simplified implementation:

``` gdscript
var _dialogue_filename = 'first_dialogue'
var _dialogue

func _ready():
    _dialogue = ClydeDialogue.new()
    _dialogue.load_dialogue(_dialogue_filename)
    _dialogue.load_data(persistence.dialogues[_dialogue_filename]) # load data


func _get_next_content():
    var content = _dialogue.get_content()

    # ...

    if content.type == "end":
        _dialogue_ended()


func _dialogue_ended():
    persistence.dialogues[_dialogue_filename] = _dialogue.get_data() # retrieve data for persistence

```

The example above assumes there is a global object called `persistence`, which is persisted every time the game is saved.

When starting a new dialogue execution, the internal data is loaded from the `persistence` object. When the dialogue ends, we update said object with the new values.

Note that the data is saved in in the dictionary under the dialogue filename key. The internal data should be used only in the same dialogue it was extracted from.

You should not change this object manually. If you want't to change a variable used in the previous execution, you should use `dialogue.set_variable(name, value)`.

``` gdscript
    # ...
    _dialogue = ClydeDialogue.new()
    _dialogue.load_dialogue(_dialogue_filename)
    _dialogue.load_data(persistence.dialogues[_dialogue_filename])

    _dialogue.set_variable("health", character.health)
```

Variables set via `set_variable` are included in the dialogue data object. This might not be ideal in cases where the data does not belong to the dialogue. For instance,
if you pass a health variable to the dialogue, all dialogues will contain a version of that value, which will increase your save file size. You can workaround this by using external variables.

## External variables

External variables are accessed using the `@` prefix. i.e. `@health`. You need to define two callbacks to allow the dialogue to access and modify external variables:

```gdscript
# ...

_dialogue.on_external_variable_fetch(func (variable_name: String):
  return persistence[variable_name]
)

_dialogue.on_external_variable_update(func (variable_name: String, value):
  persistence[variable_name] = value
)
```

`on_external_variable_fetch` will be called any time the dialogue tries to access an external variable. i.e. `{ @health > 10 }`.

`on_external_variable_update` will be called any time the dialogue tries to update an external variable. i.e `{ set @health = 100 }`

External variables are just a proxy to the game variables. No external data is stored as part of the dialogue.

## Translations / Localisation

Godot already comes with a [localisation solution](https://docs.godotengine.org/en/stable/getting_started/workflow/assets/importing_translations.html#doc-importing-translations) built-in.

The interpreter leverages this solution to translate its dialogues. Any dialogue line which contains an id defined will be translated to the current locale if a translation is available.

In case there is no translation for the id provided, the interpreter will return the default line.


## Dialogue folder and organisation

By default, the interpreter will look for files under `res://dialogues/`. In case you want to specify a different default folder, you need to change the configuration in `Project > Project Settings > Dialogue > Source Folder`.

Alternatively, you can use the full path when loading dialogues:

```gdscript
var dialogue = ClydeDialogue.new()

dialogue.load_dialogue("res://samples/banana.clyde")

```

## More examples

You can find more usage examples on the [examples](https://github.com/viniciusgerevini/godot-clyde-dialogue/tree/godot_4/addons/clyde/examples) folder.



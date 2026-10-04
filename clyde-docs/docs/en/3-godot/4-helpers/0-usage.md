<!--
page_title: Usage
nav-max: 1
-->
# Helpers Usage

You can find and try out the examples the come with the plugin in the [addon examples folder](https://github.com/viniciusgerevini/godot-clyde-dialogue/tree/godot_4/addons/clyde/examples).

Here is a quick gist of how your code looks using the helpers:

## Main dialogue script

```gdscript
extends MarginContainer

var _is_dialogue_running := false

func _ready():
  _setup_dialogue_events()


# hooked to a button signal
func _on_start_button_pressed():
  Dialogue.start_dialogue("sample_dialogue")


func _setup_dialogue_events():
  Dialogue.dialogue_started.connect(_on_dialogue_started)
  Dialogue.dialogue_ended.connect(_on_dialogue_ended)
  Dialogue.variable_changed.connect(_on_variable_changed)
  Dialogue.event_triggered.connect(_on_event_triggered)
  Dialogue.speaker_changed.connect(_on_speaker_changed)


# In your game, this signal can be used for suspending input and other actions
# so they don't conflict with the dialogue input.
func _on_dialogue_started(dialogue_name: String, block_name: String):
  print("Dialogue started: '%s' '%s'" % [dialogue_name, block_name])
  _is_dialogue_running = true


# This signal can be used to resume the game or input
func _on_dialogue_ended(dialogue_name: String, block_name: String):
  print("Dialogue ended: '%s' '%s'" % [dialogue_name, block_name])
  await get_tree().create_timer(0.5).timeout
  _is_dialogue_running = false


# A variable changed in the dialogue.
func _on_variable_changed(variable_name: String, value: Variant, old_value: Variant):
  print("Variable changed: '%s' new: '%s' old: '%s' " % [ variable_name, value, old_value ])


# Listen to events triggered by dialogue.
# One usage example is to do stuff like screen shake, play sounds or specific animations.
func _on_event_triggered(event_name: String, parameters: Array):
  print("Event triggered: '%s' params: %s" % [ event_name, parameters ])


# This event is useful for when you want to animate your speaker without hooking it
# to the dialogue box. One example is making other characters look at the talking speaker
func _on_speaker_changed(current: String, previous: String):
  print("Speaker changed. Current: '%s' Previous: '%s'" % [current, previous])


func _input(event):
  if _is_dialogue_running:
    return

  if event is InputEventKey:
    # start dialogue on any event
    _on_button_pressed()


```

## ClydeDialogueConfig with custom persistence

To use the [Dialogue](./1-dialogue_ref.md) singleton, you need to have a [ClydeDialogueConfig](./2-config_ref.md) node in your scene.

This node already comes pre-configured, and allows you to change most things, like which input actions to use, a custom dialogue box, and where to render the dialogue box.

However, to be able to persist the dialogue state, you will also have to extend the node and implement the persistence yourself. Bellow is an example of a configuration to hold data in-memory.

```gdscript

extends "res://addons/clyde/helpers/dialogue_config.gd"

# This is just a silly in memory persistence for demonstration.
# You should override this method with the proper persistence mechanism from your
# game.
var persistence = {}
var external_variables = {}

func _load_dialogue_data(dialogue_path: String, block_name: String) -> Dictionary:
	return persistence.get("%s_%s" % [ dialogue_path, block_name ], {})


func _persist_dialogue_data(dialogue_path: String, block_name: String, dialogue_data: Dictionary) -> void:
	persistence["%s_%s" % [ dialogue_path, block_name ]] = dialogue_data


func _on_external_variable_update(variable_name: String, value: Variant) -> void:
	external_variables[variable_name] = value


func _on_external_variable_fetch(variable_name: String) -> Variant:
	return external_variables.get(variable_name)

```

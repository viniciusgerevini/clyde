<!--
custom_page_class: code_ref
-->
# Dialogue Singleton Reference

The `Dialogue` autoload is automatically set by the plugin when "enable helpers" is set in Project Settings.
It allows you to start, stop and listen to dialogues from anywhere, using the "Dialogue" singleton.

## Methods

| Return | Method |
|-----|-----|
|void|[start_dialogue](#method-start_dialogue)(path: String, block: String = "", speakers: Dictionary = {})|
|void|[load_dialogue](#method-load_dialogue)(path: String, block: String = "", speakers: Dictionary = {})|
|void|[start](#method-start)()|
|Variant|[set_variable](#method-set_variable)(var_name: String, value: Variant)|
|Variant|[get_variable](#method-get_variable)(var_name: String)|
|void|[on_external_variable_fetch](#method-on_external_variable_fetch)(callback: Callable)|
|void|[on_external_variable_update](#method-on_external_variable_update)(callback: Callable)|

<hr class="section_separator" />

## Signals

<div id="signal-dialogue_started">
<b>dialogue_started</b>(dialogue_path: String, block: String)
</div>

Emitted when a dialogue started.

---

<div id="signal-dialogue_ended">
    <b>dialogue_ended</b>(dialogue_path: String, block: String)
</div>

Emitted when a dialogue ended.

---

<div id="signal-variable_changed">
<b>variable_changed</b>(variable_name: String, value: Variant, old_value: Variant)
</div>

Emitted when a dialogue variable changed.

---

<div id="signal-event_triggered">
<b>event_triggered</b>(event_name: String, parameters: Array)
</div>

Emitted when a dialogue event was triggered.

---

<div id="signal-speaker_changed">
<b>speaker_changed</b>(current_speaker: String, previous_speaker: String)
</div>

Emitted when the current line has a different speaker from the previous one.

<hr class="section_separator" />

## Method descriptions

<div id="method-start_dialogue">
void <b>start_dialogue</b>(path: String, block: String = "", speakers: Dictionary = {})
</div>

Start a dialogue. This will create the dialogue bubble based on the configuration set in
the [dialogue config node](./2-config_ref.md).

- `path`: Path to dialogue file. Path might be relative to the default dialogue folder (i.e 'my_dialogue')
or absolute 'res://my_dialogue.clyde'
- `block`: Start dialogue from this block. Empty string means the default block.
- `speakers`: This is a Dictionary where the key is the speaker id/name (defined in the dialogue file),
and the value is a dictionary with anything.<br/><br/>By default, if the value dictionary has a "variables"
property, the manager will iterate over it and populate the dialogue with them.<br /><br/>
Example:<br/>
`{
   "npc": { "variables": { "name": "Frodo" } }
}`<br/><br/>
With the object above, name will be used as the speaker display name, and also it will be mapped
to the dialogue and available to be accessed as `@npc_name`. The whole object will be passed to
the set_speaker method in the dialogue bubble as is.<br/><br/>
NOTE: Variables defined via the speakers dictionary have preference over the external variable fetch callback
and can't be edited via dialogue.

---

<div id="method-load_dialogue">
void <b>load_dialogue</b>(path: String, block: String = "", speakers: Dictionary = {})
</div>

Setup dialogue but does not execute it. You should call `start()` when ready to start dialogue.<br/>
Useful for when initial setup is required before starting.

---

<div id="method-start">
void <b>start</b>()
</div>

Start pre-loaded dialogue

---

<div id="method-set_variable">
Variant <b>set_variable</b>(var_name: String, value: Variant)
</div>

Set variable to current running dialogue
- `var_name`: variable name
- `value`: variable value

---

<div id="method-get_variable">
Variant <b>get_variable</b>(var_name: String)
</div>

Get variable from current running dialogue
- `var_name`: Variable name

---

<div id="method-on_external_variable_fetch">
void <b>on_external_variable_fetch</b>(callback: Callable)
</div>

Set callback to be used when requesting external variables.
This callback should return the value for the requested variable, which will
be used in the dialogue.

---

<div id="method-on_external_variable_update">
void <b>on_external_variable_update</b>(callback: Callable)
</div>

Set callback to be used when an external variable is updated in the dialogue


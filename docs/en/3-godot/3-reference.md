<!--
custom_page_class: code_ref
-->
# ClydeDialogue Class Reference

This plugin exposes the interpreter as `ClydeDialogue`.

The interpreter is simple, yet powerfull. The plugin also provide some [helpers](./3-helpers.md) for quick start. However, I recommend reading about the core interpreter first, to understand how things work.

For details about the language, check [the language reference page](../2-language/index.md).

## Methods

| Return | Method |
|-----|-----|
|void|[load_dialogue](#method-load_dialogue)(file_name: String, block: String = "")|
|void|[start](#method-start)(block_name: String = "")|
|Dictionary|[get_content](#method-get_content)()|
|void|[choose](#method-choose)(option_index: int)|
|Variant|[set_variable](#method-set_variable)(name: String, value: Variant)|
|Variant|[get_variable](#method-get_variable)(name: String)|
|void|[on_external_variable_fetch](#method-on_external_variable_fetch)(callback: Callable)|
|void|[on_external_variable_update](#method-on_external_variable_update)(callback: Callable)|
|Dictionary|[get_data](#method-get_data)()|
|void|[load_data](#method-load_data)(data: Dictionary)|
|void|[clear_data](#method-clear_data)()|
|void|[configure](#method-configure)(options: Dictionary)|
|bool|[has_block](#method-has_block)(block_name: String)|

<hr class="section_separator" />

## Signals

<div id="signal-variable_changed">
<b>variable_changed</b>(variable_name: String, value; Variant, previous_vale: Variant)
</div>

Emitted when a variable change.

---

<div id="signal-event_triggered">
<b>event_triggered</b>(event_name: String, parameters: Array)
</div>

Emitted when a dialogue event is triggered.

<hr class="section_separator" />

## Method descriptions

<!--# Load dialogue file-->
<!--# file_name: path to the dialogue file.-->
<div id="method-load_dialogue">
void <b>load_dialogue</b>(file_name: String, block: String = "")
</div>

Load a dialogue file.
- `file_name` is the path to the dialogue file.i.e.
- `my_dialogue`, `res://my_dialogue.clyde`, `res://my_dialogue.json`. `block`: block name to execute.

---

<div id="method-start">
func <b>start</b>(block_name: String = "") -> void
</div>

Start or restart dialogue. Data is not cleaned.
- `block_name`: optional block to run. If empty, uses current one.

---

<div id="method-get_content">
func <b>get_content</b>() -> Dictionary
</div>

Get next dialogue content. The content may be a line, options or end.

---

<div id="method-choose">
func <b>choose</b>(option_index: int) -> void
</div>

Choose one of the available options.
-  `option_index`: index starting in 0.

---

<div id="method-set_variable">
func <b>set_variable</b>(name: String, value: Variant) -> Variant
</div>

Set variable to be used in the dialogue
- `name`: variable name
- `value`: variable value

---

<div id="method-get_variable">
func <b>get_variable</b>(name: String) -> Variant
</div>

Get current value of a variable inside the dialogue.
- `name`: variable name

---

<div id="method-on_external_variable_fetch">
func <b>on_external_variable_fetch</b>(callback: Callable) -> void
</div>

Set callback to be used when requesting external variables.

- `callback`: Signature `function (var_name: String)`

---

<div id="method-on_external_variable_update">
func <b>on_external_variable_update</b>(callback: Callable) -> void
</div>

Set callback to be used when an external variable is updated in the dialogue

- `callback`: Signature `function (var_name: String, var_value: Variant)`

---

<div id="method-get_data">
func <b>get_data</b>(): Dictionary
</div>

Return all variables and internal variables. Useful for persisting the dialogue's internal
data, such as options already choosen and random variations states.

---

<div id="method-load_data">
func <b>load_data</b>(data: Dictionary) -> void
</div>

Load internal data retrieved before via `get_data`.

---

<div id="method-clear_data">
func <b>clear_data</b>() -> void
</div>

Clear dialogue state and related data.

---

<div id="method-configure">
func <b>configure</b>(options: Dictionary) -> void
</div>

Set optional settings for current interpreter.
- Options:
   `include_hidden_options`: (`boolean`, default `false`): Conditional options which checks result in false, will still be included in the option list.

---

<div id="method-has_block">
func <b>has_block</b>(block_name: String) -> bool
</div>

Verifies if current dialogue contains block with given name.


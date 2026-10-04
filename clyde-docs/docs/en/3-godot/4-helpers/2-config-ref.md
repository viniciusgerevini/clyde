<!--
custom_page_class: code_ref
-->
# ClydeDialogueConfig

Node to configure the [Dialogue](./1-dialogue_ref.md) helper. Allow customising, dialogue bubbles, input options, etc.

Add this to the canvas used as HUD in your scene, as it will create the dialogue box for you.

## Properties

| Type | Method | Default |
|-----|-----|----|
|PackedScene|[_dialogue_bubble](#prop-_dialogue_bubble)| |
|Node|[_dialogue_bubble_container](#prop-_dialogue_bubble_container)| |
|String|[_next_content_input_action_name](#prop-_next_content_input_action_name)|`"ui_accept"`|
|String|[_cancel_selection_input_action_name](#prop-_cancel_selection_input_action_name)|`"ui_cancel"`|
|String|[_select_option_input_action_name](#prop-_select_option_input_action_name)|`"ui_accept"`|
|String|[_next_option_input_action_name](#prop-_next_option_input_action_name)|`"ui_down"`|
|String|[_previous_option_input_action_name](#prop-_previous_option_input_action_name)|`"ui_up"`|

<hr class="section_separator" />

## Methods

| Return | Method |
|-----|-----|
|Dictionary|[_load_dialogue_data](#method-_load_dialogue_data)(dialogue_path: String, block_name: String)|
|void|[_persist_dialogue_data](#method-_persist_dialogue_data)(dialogue_path: String, block_name: String, dialogue_data: Dictionary)|
|void|[_on_external_variable_update](#method-_on_external_variable_update)(variable_name: String, value: Variant)|
|Variant|[_on_external_variable_fetch](#method-_on_external_variable_fetch)(variable_name: String)|

<hr class="section_separator" />

## Property descriptions

<div id="method-_dialogue_bubble">
    PackedScene <b>_dialogue_bubble</b>
</div>

The scene to be used as dialogue bubble

---

<div id="method-_dialogue_bubble_container">
    Node <b>_dialogue_bubble_container</b>
</div>

Where in the tree should dialogue bubbles be added to. If no Node selected this Node's parent will be used

---

<div id="method-_next_content_input_action_name">
    String <b>_next_content_input_action_name</b> = "ui_accept"
</div>

Action name from Input Map to listen to go to next content

---

<div id="method-_cancel_selection_input_action_name">
    String <b>_cancel_selection_input_action_name</b> = "ui_cancel"
</div>

Action name from Input Map for when in selection mode, try to stop selection

---

<div id="method-_select_option_input_action_name">
    String <b>_select_option_input_action_name</b> = "ui_accept"
</div>

Action name from Input Map to listen to select highlighted option

---

<div id="method-_next_option_input_action_name">
    String <b>_next_option_input_action_name</b> = "ui_down"
</div>

Action name from Input Map to listen to go to next option

---

<div id="method-_previous_option_input_action_name">
    String <b>_previous_option_input_action_name</b> = "ui_up"
</div>

Action name from Input Map to listen to go to previous option


<hr class="section_separator" />


## Method descriptions


<div id="method-_load_dialogue_data">
  Dictionary <b>_load_dialogue_data</b>(dialogue_path: String, block_name: String)
</div>

_This method should be overriden_<br/>
Should return any existing persistence object for the dialogue. Return empty if first run.

---

<div id="method-_persist_dialogue_data">
  void <b>_persist_dialogue_data</b>(dialogue_path: String, block_name: String, dialogue_data: Dictionary)
</div>

_This method should be overriden_<br/>
Called after a dialogue is finished. Should be used for persisting
dialogue data.

---

<div id="method-_on_external_variable_update">
  void <b>_on_external_variable_update</b>(variable_name: String, value: Variant)
</div>


_This method should be overriden_<br/>
Called when an external variable is updated via dialogue (i.e. `{ set @hp = 100 }`)<br/>
This method should be used to update the external storage with the new value.

---

<div id="method-_on_external_variable_fetch">
  Variant <b>_on_external_variable_fetch</b>(variable_name: String)
</div>

_This method should be overriden_<br/>
Called when an external variable is accessed in the dialogue (i.e. `@is_alive`).<br/>
The value returned in this method will be used in the dialogue.


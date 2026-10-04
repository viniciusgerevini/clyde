<!--
    nav_max: 0
-->
# Exchanging information between your dialogues and your game

Clyde's design separates the dialogue responsibility from the rest of your game. This is essencial to keep the dialogue language simple and allowing evolving your dialogues and your game at their own pace.

At some point though, you will want to exchange information or communicate changes between game and dialogues. Here are a few examples how to achieve that.

## Use external variables to fetch and update game data

This is likely the most common use-case. Your dialogue might have conditions based on your game's state. Or maybe you might want to change some values in your game depending on what the player chooses in their dialogue. This can all be achieved by using [external variables](../2-language/6-logic.md#external-variables). 

### Example 1: Show line depending on player's health

Here is a sample dialogue:

```clyde
npc: Hello, hero!
npc: you don't look so good today { @hp < 10 }
```

The second line will only be shown if the variable `hp` is under 10. As explained in the [external variables](../2-language/6-logic.md#external-variables) section, the `@` symbol signifies the variable is external and it is not stored as part of the dialogue. This will trigger the external variable fetch callback. Example in GDScript:

```gdscript
func _ready():
    _dialogue = ClydeDialogue.new()
    _dialogue.load_dialogue('mission_1')
    # external variable callback setup
    _dialogue.on_external_variable_fetch(_on_external_variable_fetch)


func _on_external_variable_fetch(variable_name: String):
    if variable_name == "hp":
        return $player.get_health()


```

Whatever you return in the fetch callback is the value your dialogue is going to receive. This also allows you to calculate variables in runtime. For instance, maybe instead of performing the `hp` check on every line that requires it, you can abstract it from the dialogue this way:

In your dialogue:

```clyde
npc: you don't look so good today { @has_low_hp }
```

In your fetch method:

```gdscript
func _on_external_variable_fetch(variable_name: String):
    match variable_name:
        "hp":
            return $player.get_health()
        "has_low_hp":
            return $player.get_health() < 10

```

In my opinion, abstracting magic numbers from your dialogue is a more elegant solution, and you should favour that whenever possible.

But what if you'd like to change the player's hp via dialogue?


### Example 2: Update game variables via dialogue

Besides the fetch callback explained in the previous section, you can also configure a callback for updating external variables, which will propagate any value from your dialogue to your code. For example:

```clyde
{ @has_low_hp }
    npc:
        You don't look so good today.
        Let me heal you... { set @hp = 100 }
```

In GDScript, your dialogue setup will look like this:

```gdscript
func _ready():
    _dialogue = ClydeDialogue.new()
    _dialogue.load_dialogue('mission_1')
    _dialogue.on_external_variable_fetch(_on_external_variable_fetch)
    _dialogue.on_external_variable_update(_on_external_variable_update)


func _on_external_variable_fetch(variable_name: String):
    match variable_name:
        "hp":
            return $player.get_health()
        "has_low_hp":
            return $player.get_health() < 10


func _on_external_variable_update(variable_name: String, value: Variant):
    if variable_name == "hp":
        $player.set_health(value)


```

But what if you wish to increment/decrement the existing value instead of replacing it? You can do something like this:

```clyde
npc: what do you want to drink?
    + Healing potion
        npc: Here it goes { set @hp += 20 }
    + Strong healing potion
        npc: Wise decision { set @hp += 70 }
    + Poison
        npc: This is going to sting { set @hp -= 20 }
```

The setup from before is enough to handle this dialogue. Just keep in mind that doing something like `@hp += 10` is the equivalent to `@hp = @hp + 10`, so for this to work you need to make sure the fetch callback also handles the `hp` variable.

The dialogue above is helpful in various scenarios. However, we brought back some hardcoded numbers. There is a cleaner way to implement the same using `events`. Let's talk about it.

## Using events for one-way communication

[Events](../2-language/6-logic.md#triggers) are a simpler way to communicate with your game. They are defined via `trigger` blocks. Here is the last example from the previous section adapted to use events.

```clyde
npc: what do you want to drink?
    + Healing potion
        npc: Here it goes { trigger drink_healing_potion }
    + Strong healing potion
        npc: Wise decision { trigger drink_strong_healing_potion }
    + Poison
        npc: This is going to sting { trigger drink_poison }
```


GDScript:
```gdscript
func _ready():
    _dialogue = ClydeDialogue.new()
    _dialogue.load_dialogue('mission_1')
    _dialogue.on_external_variable_fetch(_on_external_variable_fetch)
    _dialogue.on_external_variable_update(_on_external_variable_update)

    _dialogue.event_triggered.connect(_on_event_triggered)


func _on_event_triggered(event_name, parameters):
    match event_name:
        "drink_healing_potion":
            $player.heal(20)
        "drink_strong_healing_potion":
            $player.heal(70)
        "drink_poison":
            $player.damage(10)

```
The advantage of this example over using variables is that the actual HP value is hidden from your dialogue. This allows your dialogue to trigger the intended behaviour, but it lets your game to decide the actual value. Maybe healing is a percentage, or maybe there are other buffs or debuffs to consider when calculating it. That's better abstracted from your dialogue.

You might have noticed the `parameters` argument in the example before. This is an array with values sent with your event. Here is the previous example with parameters:

```clyde
npc: what do you want to drink?
    + Healing potion
        npc: Here it goes { trigger drink_potion("hp") }
    + Strong healing potion
        npc: Wise decision { trigger drink_potion("strong_hp") }
    + Poison
        npc: This is going to sting { trigger drink_potion("poison") }
```

Event handler:

```gdscript
func _on_event_triggered(event_name, parameters):
    match event_name:
        "drink_potion":
            _apply_potion_effect(parameters[0])

```

## Advanced topics

The examples above are all you need for data exchange between dialogues and the game. Here I'm going to list some extra tips and examples I think might be useful for improving the code.


### Event registry

Needless to say the event list from your dialogue might grow a lot, even more if you always define the same event handler for all your dialogues. I think a good solution is to implement some sort of event registry.

Implementation details may vary, but as a basic example let's just implement an array with the mapping:

```gdscript

var _event_registry: Dictionary[String, Callable] = {
    "drink_potion": _on_drink_potion,
    "damage": _on_damage,
}


func _on_event_triggered(event_name, parameters):
    if _event_registry.has(event_name):
        _event_registry[event_name].call(parameters)


```

This makes your handler cleaner. As an improvement, you can move the list to another script, or encapsulate the registration and mapping logic in its own class.


### Variable groupings

One thing I do in my games, which I think helps a lot with variables organization, is defining prefixes that are handled differently. For example, any data related to one of the speakers in the dialogue I prefix with the pattern  `<speaker>_`. This allows me to source speaker data from a different place from the regular data.

For example:

```clyde
npc: Hello, %@player_name%! Long time no see...
player: Hey, %@npc_name%! Yeah, I've been away for %@last_downtime%...
```

The fetch callback looks like this:

```gdscript

func _on_external_variable_fetch(variable_name: String):
    if _is_speaker_variable(variable_name):
        return _get_speaker_variable(variable_name)

    return _persistence.get_variable(variable_name)


func _is_speaker_variable(variable_name: String) -> bool:
    var parts := variable_name.split("_", true, 1)
    if parts.size() < 2:
        return false
    var prefix = parts[0]
    var var_name = parts[1]

    if not _speaker_data.has(prefix) or not _speaker_data[prefix].has("variables"):
        return false

    if not _speaker_data[prefix].variables.has(var_name):
        return false

    return true


```

In the example above, any speaker variable will come from the _speaker_data related to the running dialogue. Anything else comes from a global persistence object.

Another good example is defining a prefix to get live scene data. This would allow reaching to scene information via variables. e.g something like `scene_enemy_count` could return the value for  `get_nodes_in_group("enemy").size()`.

## Further reading

For more ideas on how to exchange data with dialogues, check the [Disco Elysium sample project](./7-disco-elysium.md).


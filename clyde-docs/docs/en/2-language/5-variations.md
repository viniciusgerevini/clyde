<!--
custom_page_class: lang_ref
-->
# Variations

You can use variation blocks `(` `)` to return a different message every time the dialogue is executed. Each variation is defined by starting the line with `-`.

```clyde
-- this will pick one of the three greetings randomly
( shuffle cycle
    - Hi!
    - Hello!
    - Hey!
)

What are you doing here?
-- this will cycle between these two blocks in order
(
   -
     I thought you were travelling!
     Far abroad.
   -
     I thought you were dead!
     I know! How dark is that?.
)
```

There are a few different modes available for variations (`sequence`, `once`, `cycle`, `shuffle`):

**cycle**(default): This option returns each item and starts from the begining once it reaches the end.

**sequence**: It will return each item once, and then it will stick to the last one.

For example, in the following block, the first time will return `Once`, the second time `Twice` and every other call after that will return `I lost count...`.

```clyde
( sequence
   - Once
   - Twice
   - I lost count...
)
```

**once**: Like sequence, but returns each item only once. Using the previous example, after `I lost count...` is shown, the next dialogue calls will not return any of those lines anymore, skipping straight to the next line in the dialogue.

**shuffle**: Randomize variations. Any of the previous options can be used in combination with shuffle. (`shuffle`, `shuffle sequence`, `shuffle once`, `shuffle cycle`).


The following example will show each item following a random sequence. Once all items are shown, the sequence will be randomised again, and it will return the items in a different order.

```clyde
( shuffle cycle
   - Executor?
   - Your command?
   - What would you ask of me?
   - I hunger for battle...
)
```


Note: `shuffle sequence`, `shuffle cycle` and `shuffle once` modes guarantee every variation will be returned before restarting a new randomization cycle. The standalone `shuffle` mode works as regular randomization, with no guarantee all items will be visited or not repeated.

Variations can be nested and may contain other elements, like options and diverts:

```clyde
npc: How is the day today?
( shuffle once
   -
     npc2: Rainny
     npc: do you like rainny days?
        * yes
        * no
   -
     npc2: Sunny
     -> sunny days rambling
   -
    ( shuffle
     - not to bad
     - good
    )
)

== sunny days rambling
something something
```


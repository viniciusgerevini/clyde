<!--
custom_page_class: lang_ref
nav_max: 2
-->
# Logic, conditions, variables and events

Now that you know the basics, you can step up your branching game by using variables and conditions with logic blocks, defined by `{` and `}`.

Logic blocks may contain:


**Logical operators:**: Equals `==` or `is`, Not equals: `!=` or `isnt`, Not: `!` or `not`, Greater, Less, etc: `>`, `<`, `>=`, `<=`.

**Math operators**: sum `+`, subtract `-`,  multiply `*`, divide `/`,  power `^`,  modulo/remainder `%`.

**Assignment operators**: assign `=`, sum `+=`, subtract `-=`, multiply `*=`, divide `/=`, power `^=`, modulo `%=` and init `?=`.

**Literals**: Number (`100`, `1.5`), String (`"some text"`, `'some text'`), Boolean (`true`, `false`), Null (`null`).

**Keywords**: `set`, `trigger`, `when`, `match`.

There are three types of logic blocks: assignments, conditions, and triggers.

## Assignments

Besides setting variables using the interpreter method, you can set variables internally with assignment blocks. Assignment blocks need to start with the `set` keyword. Here are some examples:

```clyde
-- assignment only line
{ set is_happy = true }

-- after line
some text here { set is_happy = true }

-- before line
{ set is_happy = true } some text here

-- both sides
{ set something = 1 } some text here { set something += 1 }

-- multiple assignments
some text here { set is_happy = true, is_naughty = false, a = b, b = 2 }

-- for boolean true assignments, the value can be omitted
{ set is_happy }
```

Regardless of the position, the assignment will always be executed when the line is returned.

The initializer assigment `?=` can be used when you wish to only set the variable if it's still unset.

```clyde
{ set count ?= 1 } -- count will be set to 1

{ set count ?= 2 } -- count will remain 1, as it's already set
```

## Conditions

Conditions are used to control which lines should be shown. They do not require any special keyword, but you can optionally use `when` to explicitly show that the block is a condition. Examples:

```clyde
{ set something = true }
{ set gender = "female" }

-- after line
some text here { something }

-- before line
{ not something } some text here

-- with when keyword
some text here { when not something }

-- both sides
{ something } some text here { something_else }

-- complex conditions
some text here { something and a == b or b >= c and not v }
some text here { something && a == b || b >= c && ! v }

-- with options
+ { not something } options a
* { hp < 50 } options b
* options c { when hp == 30 }

-- with variations
( cycle
    - Hello, sister. { when gender == "female" }
    - Hello, brother. { when gender == "male" }
)

-- with multiple lines
{ something }
    one line
    another line
    yet another line
```

As you may have noticed, you can't mix assignments and conditions in the same block. However, you can define multiple blocks in the same line, like this:

```clyde
say something { when not something } { set something = true }
```

Just be aware that order matters. i.e.

```clyde
-- Condition is checked before assignment. This line won't be returned.
say something { when something } { set something = true }

-- Condition is checked after assignment. This line will be returned.
say something { set something = true } { when something }

-- Condition is checked before assignment.  This line won't be returned.
{ when something }  say something { set something = true }

-- Condition is checked after assignment. This line will be returned.
{ set something = true } say something { when something }
```
## Match conditions

You can use the `match` keyword to create a condition with multiple branches. Only one branch is executed.

```clyde
{ match skill_type
    'melee':
        Hero:   I need to get closer!
        Helper: Wouldn't that be dangerous?
    'ranged':
        Hero: I reckon we can hit it from here.
        Helper: This sounds wise!
    default:
        Hero: Not sure what I'm supposed to do
        Helper: Just wing it!
}
```

As seen above, the `default` keyword can be used to define the branch that should be executed if none of the previous values match.

Match blocks accept complex conditions and inline branch content:

```clyde
{ match hp < 10 and can_heal
    true: -> healing conversation
    false: -> another block
}
```

## Triggers

There may be cases where you'd want your game to be notified that something happened in your dialogue. There are two ways to achieve that: by triggering events or by observing variable changes.

You can trigger events using the `trigger` block.

```clyde
* allow { trigger allowed }
* deny { trigger denied }
```

Events also accept parameters, like this:
```clyde
-- you can pass literal arguments
{ trigger my_event("some text", 1, true) }

-- you can pass variables
{ trigger my_event(this_is_a_variable) }

-- and even expressions
{ trigger my_event(some_important_count + something_else) }
```


Your interpreter will expose a way to listen to these events. This will vary depending on implementation. To use the JavaScript interpreter as example:

```javascript
dialogue.on(Clyde.EVENT_TRIGGERED, (eventName) => {
    if (eventName === 'allowed') {
        console.log("do something");
    }
});
```

You can also listen to variables changes, like this:

```javascript
dialogue.on(Clyde.VARIABLE_CHANGED, (name, value, previousValue) => {
    if (name === 'hp' && previousValue < value) {
        console.log("damage taken");
    }
});
```

## Using variables in text

You can use values from variables in your text by referencing them with `%` `%`.

```clyde
{ set playerName = 'Vini' }
Hello, %playerName%! Long time no see.
```

This should print `Hello, Vini! Long time no see!`

This can be used with variables defined internally or externally.

## External variables

External variables can be accessed using the `@` prefix. They are saved outside the dialogue data and the interpreter should provide callbacks to fetch and update these variables.

They are useful when dealing with data that belongs to your game and shouldn't be persisted within the dialogue data. They can be set and used in the dialogue like this:

```clyde
-- set
{ set @hp = 10 }

-- use
{ @hp > 10 }

-- interpolation
Hello, %@player_name%!
```

Here is an example on how the callbacks to fetch and update the data can be used:

```typescript
dialogue.onExternalVariableFetch((name: string): any => {
    return my_persistence_object[name];
});

dialogue.onExternalVariableUpdate((name: string, value: any): void => {
    my_persistence_object[name] = value;
});

```

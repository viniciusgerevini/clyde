<!--
custom_page_class: lang_ref
-->
# Blocks and Diverts

Nesting content can get messy real quick. An alternative is to group your content in blocks `== BLOCK NAME`, and use diverts `-> BLOCK_NAME` to link them. `BLOCK_NAME` should be `[A-Za-z0-9_- ]`.

```
What do you want to talk about?
    * Life
      -> talk about life
    * The universe
      -> talk about the universe
    * Everything else...
      -> talk about everything else

== talk about life
player: I want to talk about life!
npc: Well! That's too complicated...

== talk about the universe
player: I want to talk about the universe!
npc: That's too complex!

== talk about everything else
player: What about everything else?
npc: I don't have time for this...

```

``` javascript
// get content
{
    type: 'options',
    text: 'What do you want to talk about?'
    options: [
        { text: 'Life' },
        { text: 'The universe' },
        { text: 'Everything else' }
    ]
}

// choose 1

// get content
{ type: 'line', speaker: 'player', text: 'I want to talk about the universe!' }

// get content
{ type: 'line', speaker: 'npc', text: "That's too complex!" }
```

Blocks also allow you to have multiple dialogues in the same file and run them independently from each other.

## Divert to parent

You can use `<-` to divert back to the parent block or parent option list.

By default, blocks do not return to their callers.

Because of that, in the following example, the `npc: Let's continue...` line will never be called.
```
npc: What do you want to do?

-> talk about life

npc: Let's continue with another conversation.



== talk about life
player: I want to talk about life!
npc: Well! That's too complicated...

```

To resume the progression on the caller block, you should use a divert to parent `<-`.

```
npc: What do you want to do?

-> talk about life

npc: Let's continue with another conversation.


== talk about life
player: I want to talk about life!
npc: Well! That's too complicated...
<-

```

Diverts to parent can also be used in the options list, to allow the player to go through all options if they wish to.

```
What do you want to talk about?
    * Life
      -> talk about life
      <-
    * The universe
      -> talk about the universe
      <-
    * Everything else...
      -> talk about everything else
      <-
    + Nothing in special
        I don't want to talk about anything.

npc: That's all for today!

-- blocks definitions after this line

== talk about life
player: I want to talk about life!
npc: Well! That's too complicated...
<-

== talk about the universe
player: I want to talk about the universe!
npc: That's too complex!
<-

== talk about everything else
player: What about everything else?
npc: I don't have time for this...
<-
```

You can join both diverts together in the same line for a cleaner look:

```
What do you want to talk about?
    * Life
      -> talk about life <-
    * The universe
      -> talk about the universe <-
    * Everything else...
      -> talk about everything else <-
    + Nothing in special
        I don't want to talk about anything.
```

## Ending a dialogue

By default, the dialogue ends when it reaches a point with no next line available.  But you can also end a dialogue earlier by using `-> END`.

```
Do you wish to continue?
    + Yes
    + Maybe
        <-
    + No
        -> END

As I was saying...
```

The first option will continue to line `As I was saying...`. The second option will return to the options list so you can choose again. The third option will end the dialogue and ignore any subsequent line.


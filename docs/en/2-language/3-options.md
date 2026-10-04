<!--
nav_max: 2
custom_page_class: lang_ref
-->
# Options (a.k.a branches)

Options are how you do branching dialogues. You can use it to ask a question, or give the player a list of topics to choose from.

To define options you can use `*` (single use), `+` (sticky) or `>` (fallback).

## Simple options
```clyde
* yes
  Let's do this!
* no
  Not this time!

continue
```

Output:
```javascript
// get content
{
    type: 'options',
    options: [
        { text: 'yes' },
        { text: 'no' },
    ]
}

// choose 0

// get content
{ type: 'line', text: "Let's do this!" }

// get content
{ type: 'line', text: 'continue'}
```

### Returning options text as dialogue lines:

By default, option labels are not returned as dialogue lines. If you wish to return them, you can use the option display character `=`:
```clyde
*= yes
*= no

continue
```

Output:
```javascript
// get content
{
    type: 'options',
    options: [
        { text: 'yes' },
        { text: 'no' },
    ]
}

// choose 0

// get content
{ type: 'line', text: 'yes'}

// get content
{ type: 'line', text: 'continue'}
```

## Options title

You can define a text to be returned with your options list by indenting its definition:

```clyde
Do you like turtles?
    *= Yes
    *= No
```

Output

```javascript
// get content
{
    type: 'options',
    text: 'Do you like turtles?',
    options: [
        { text: 'Yes' },
        { text: 'No' }
    ]
}

// choose 0

// get content
{ type: 'line', text: 'Yes'}
```

This is useful for providing more context to the option list. Specially useful when your UI uses a single bubble mode and doesn't show previous dialogue lines.

### Nested content

Any content can be nested inside an option. Such as

Multiple lines:

```clyde
* I need to think about that
    some line
    some other line
*= Simple option

continue
```

Output
```javascript
// get content
{
    type: 'options',
    options: [
        { text: 'I need to think about that' },
        { text: 'Simple option' },
    ]
}

// choose 0

// get content
{ type: 'line', text: 'some line'}

// get content
{ type: 'line', text: 'some other line'}

// get content
continue
```

Other options:

```clyde
* Option a - has nested options
    *= Yes
    * No
        nope
*
    Option b - starts in another line
    and goes on...
        and on

continue
```

Output
```javascript
// get content
{
    type: 'options',
    options: [
        { text: 'Option a - has nested options' },
        { text: 'Option b - starts in another line' }
    ]
}

// choose 0

// get content
{
    type: 'options',
    options: [
        { text: 'Yes' },
        { text: 'No' }
    ]
}

// choose 1

// get content
{ type: 'line', text: 'Nope'}

// get content
{ type: 'line', text: 'continue'}
```

In a later section we will talk about blocks and diverts, which mitigate the need of too much nesting.

## Sticky options

Options defined with `*` are single use. This means they are removed from the list once selected. To keep an option always visible you need to define it with `+` for sticky options.

```clyde
+ Option a
    A
* Option b
    B

```

Output
```javascript
// get content
{
    type: 'options',
    options: [
        { text: 'Option a' },
        { text: 'Option b' },
    ]
}

// choose 0

// get content
{ type: 'line', text: 'A'}

// restart dialogue

// get content
{
    type: 'options',
    options: [
        { text: 'Option a' }, // option a is still in the list
        { text: 'Option b' },
    ]
}

```

## Fallback options

A fallback option (`>`) is an option that is executed automatically when there is no other option available. When more than one option is available, it behaves like a sticky option (can be selected multiple times).

```clyde
* Let's talk about it.
    A
> That's all for today.
    B
```

Output
```javascript
// get content
{
    type: 'options',
    options: [
        { text: "Let's talk about it." },
        { text: "That's all for today." },
    ]
}

// choose 0

// get content
{ type: 'line', text: 'A'}

// restart dialogue

// get content
{ type: 'line', text: 'B'}

```
In the example above, after the first option is used, the only option remaining is a fallback option. The next time content is requested the fallback option's content is returned without the need to select anything.


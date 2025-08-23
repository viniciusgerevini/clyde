<!--
nav_max: 2
custom_page_class: lang_ref
-->
# Options (a.k.a branches)

To define options or branches you can use `*` (single use), `+` (sticky) or `>` (fallback).

## Simple options
```
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

### Your options may be single lines:

By default, option labels are not returned as content. If you want to return a label, you can
use the option display character `=`:
```
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

### It may contain multiple lines:
```
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

## Nested options

Options can be nested:

```
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

## Options list's title

Depending on how you show your dialogue, your options list may lose its context. To prevent that, you can define titles for your options list by indenting its block.

```
Do you like turtles?
    *= Yes
    *= No
```

Output

```javascript
// get content
{
    type: 'options',
    text 'Do you like turtles?',
    options: [
        { text: 'Yes' },
        { text: 'No' }
    ]
}

// choose 0

// get content
{ type: 'line', text: 'Yes'}
```

## Sticky options

Option's default behaviour is to be removed from the list once used, but this is not always the desired behaviour. To keep the option always visible, you can use `+` for sticky options.

```
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
        { text: 'Option a' },
        { text: 'Option b' },
    ]
}

```

## Fallback options

A fallback option (`>`) is an option that is executed automatically when there is no other option available. When more than one option is available, it behaves like a sticky option.

```
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
In the example above, after the first option is used, the only option remaining is a fallback option. The next time content is requested the fallback option's content is returned without the need of selecting the option.


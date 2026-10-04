<!--
custom_page_class: lang_ref
-->
# Linking files

To organise your dialogues further, you can access blocks defined in other files by linking them using the `@link` keyword.

Here is a simple example importing a `shopkeeper.clyde`
```clyde
@link shopkeeper

-> @shopkeeper.greeting
```

- `@link shopkeeper` makes the file accessible via `@shopkeeper`
- Diverts work the same way as with normal blocks. You just need to use the format `-> @<file identifier>.<block name>` to divert to a linked file.
    - `<file identifier>` follows the identifier format. `<block name>`follows the block name format. 
- Diverting without providing a block name (i.e. `-> @other_file`) will execute the default block in the other file.
- `@link` does not check if the file exists or is valid. Parsing will only happen in runtime when diverting to the file for the first time.

Here are a few different ways you can reference files:

- `@link greetings`: references a greetings.clyde file in the default dialogue folder.
- `@link external_greetings = greetings`: same as the first one, but allows you to set a different name for the link
- `@link greetings = ../greetings`: references greetings.clyde file relative to the current file.
- `@link greetings = res://dialogue_samples/greetings.clyde`: absolute link


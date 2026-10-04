<!--
page_title: Home
template: home
nav_max: 1
-->
# Clyde Dialogue

```clyde

Clyde:
	Clyde is a language for writing game dialogues. It supports branching,
		translations and interfacing with your game through variables and events.
        This bubble is a real interpreter running the dialogue bellow.
	Do you wanna hear more?
		+ Yes
			-> yes branch
		+ No, thanks
			-> no branch

Clyde: Have fun! #happy

== yes branch
Clyde:
	Excellent! There is a lot to talk about, but
		this is a brief example. #happy
	Hopefully, this is enough to grab your attention.
	If you want to know more about the language, check the %language_reference_page%.
	If you are using Godot, the %godot_page% has lots of useful information on how
		to set up and use the integration.
	Now if you rather use your own text editor, or a different programming language, take a look at
			the %tools_page%.
Mr. Pink: Hey, buddy! Time to go!
Clyde: Oops! See you later! #happy


== no branch
Clyde: Oh! OK! I get it! Feel free to explore the site on your own. #sad
 
```

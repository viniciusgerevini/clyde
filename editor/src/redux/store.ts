import { configureStore } from '@reduxjs/toolkit'
import throttle from 'lodash/throttle';

import reducer from './reducers';

import { createEmptyState as createEmptyEditorState } from './editor';
import { loadState, saveState } from '../storage/local-storage';

const EDITOR_DEFAULT_VALUE = `--
--
-- This is a sample dialogue.
--

Narrator: Hello there!
Player: Hi!
Narrator: What do you want to talk about?
  + Life
    -> about life <-
  + The universe
    -> about the universe <-
  * Everything else... #some_tag
    -> about everything else <-
  + Earth
    -> about earth <-
  + Nothing
    -> goodbye <-


== about life
Player: I want to talk about life!
Narrator: Well! That's complicated...
<-


== about the universe
Player: I want to talk about the universe!
( shuffle
  - Narrator: That's too complex!
  - Narrator: Maybe another time.
  - Narrator: It's big...
              I think that's all.
)
<-


== about everything else
Player: What about everything else?
Narrator: I don't have time for this... #bored
<-

== about earth
Player: What do you know about earth?
( sequence
 - Narrator: It's mostly harmless.
 - Narrator: This again?
             I've already told you, mostly harmless.
 -
   Narrator: Why do you want to know so much about it?
   Player: I don't know...
   Narrator: So.. don't ask!

 - Narrator: I'm not talking about this anymore.
)
<-

== goodbye
{ not alreadyIntroduced }
  Narrator: It was nice to meet you!
  Player: I can say the same. See you around!
  { set alreadyIntroduced = true }
Player: Bye!
Narrator: Good bye!
`;


const load = () => {
  const data = loadState() || { editor: createEmptyEditorState() };

  if (!data.editor.currentValue) {
    data.editor.currentValue = EDITOR_DEFAULT_VALUE;
  }

  return {
    editor: data.editor,
    interpreter: {
      document: undefined,
      events: [],
      timeline: [],
      ...data.interpreter
    }
  };
};

export const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: load(),
});

store.subscribe(throttle(() => {
  const state = store.getState();
  const {
    shouldShowExtraMetadata,
    shouldShowDebugPane,
    debugPaneDirection,
    singleBubblePresentation,
  } = state.interpreter;

  saveState({
    editor: {
      preferences: state.editor.preferences,
      currentValue: state.editor.currentValue
    },
    interpreter: {
      shouldShowExtraMetadata,
      shouldShowDebugPane,
      debugPaneDirection,
      singleBubblePresentation,
    },
  });
}, 1000));

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

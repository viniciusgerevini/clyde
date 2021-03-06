import { connect } from 'react-redux';

import MainPanels from './MainPanels';

import {
  toggleEditor,
  toggleInterpreter,
  changeInterpreterSplitDirection
} from '../redux/interface';

import {
  setBlock,
  addDialogueLine,
  clearTimeline,
  showExtraMetadata,
  hideExtraMetadata,
  showDebugPane,
  hideDebugPane,
  enableSingleBubbleDialogue,
  disableSingleBubbleDialogue,
  chooseOption,
  notifyEvent,
  clearEvents,
} from '../redux/interpreter';

import {
  setDocumentContent,
  updatePreference
} from '../redux/editor';

const mapStateToProps = (state, props) => ({
  ...state.interfaceConfig,
  editorDefaultValue: state.editor.currentValue,
  editorPreferences: state.editor.preferences,
  ...state.interpreter,
  ...props
});

const mapDispatchToProps = dispatch => ({
  toggleEditor: (state) => {
    dispatch(toggleEditor({state}));
  },
  toggleInterpreter: (state) => {
    dispatch(toggleInterpreter({state}));
  },
  changeInterpreterSplitDirection: (direction) => {
    dispatch(changeInterpreterSplitDirection({direction}));
  },
  setBlock: (blockName) => {
    dispatch(setBlock(blockName));
  },
  addDialogueLine: (line) => {
    dispatch(addDialogueLine(line));
  },
  clearTimeline: () => {
    dispatch(clearTimeline());
  },
  showExtraMetadata: () => {
    dispatch(showExtraMetadata());
  },
  hideExtraMetadata: () => {
    dispatch(hideExtraMetadata());
  },
  showDebugPane: () => {
    dispatch(showDebugPane());
  },
  hideDebugPane: () => {
    dispatch(hideDebugPane());
  },
  enableSingleBubbleDialogue: () => {
    dispatch(enableSingleBubbleDialogue());
  },
  disableSingleBubbleDialogue: () => {
    dispatch(disableSingleBubbleDialogue());
  },
  chooseOption: (optionIndex) => {
    dispatch(chooseOption(optionIndex));
  },
  setDocumentContent: (content) => {
    dispatch(setDocumentContent(content));
  },
  notifyEvent: (event) => {
    dispatch(notifyEvent(event));
  },
  clearEvents: () => {
    dispatch(clearEvents());
  },
  updateEditorPreference: (name, value) => {
    dispatch(updatePreference({ name, value }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainPanels);


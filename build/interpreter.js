import { Interpreter } from "@clyde-lang/interpreter";
import { parse } from "@clyde-lang/parser";

if (typeof window !== 'undefined') {  
  window.ClydeInterpreter = Interpreter;
  window.ClydeInterpreter.createDialogue = (dialogueString) => {
    const content = parse(dialogueString);
    return Interpreter(content);
  }
}

import { parse } from '@clyde-lang/parser';
import { EventType } from './events';
import { Interpreter, DialogueLine, DialogueOptions } from './interpreter';

describe("Interpreter", () => {
  describe('lines', () => {
    it('get lines', () => {
      const content = parse('Hello!\nHi there.\nHey.#tag\n');
      const dialogue = Interpreter(content);

      expect(dialogue.getContent()).toEqual({ type: 'line', text: 'Hello!' });
      expect(dialogue.getContent()).toEqual({ type: 'line', text: 'Hi there.' });
      expect(dialogue.getContent()).toEqual({ type: 'line', text: 'Hey.', tags: ['tag']});
    });

    it('get lines with details', () => {
      const content = parse('speaker1: Hello! $123\nspeaker2: Hi there. $abc\n');
      const dialogue = Interpreter(content);

      expect(dialogue.getContent()).toEqual({ type: 'line', text: 'Hello!', speaker: 'speaker1', id: '123'});
      expect(dialogue.getContent()).toEqual({ type: 'line', text: 'Hi there.', speaker: 'speaker2', id: 'abc' });
    });
  });

  describe('Events', () => {
    it('trigger event on variable changed', (done) => {
      const content = parse('Hi!{ set something = 123 }\n');
      const dialogue = Interpreter(content);

      dialogue.setVariable('something', 456);

      dialogue.on(EventType.VARIABLE_CHANGED, (data: any) => {
        expect(data).toEqual({ name:'something', value: 123, previousValue: 456 });
        done();
      });

      dialogue.getContent()
    });

    it('trigger event on external variable changed', (done) => {
      const content = parse('Hi!{ set @something = 123 }\n');
      const dialogue = Interpreter(content);

      dialogue.setExternalVariable('something', 456);

      dialogue.on(EventType.EXTERNAL_VARIABLE_CHANGED, (data: any) => {
        expect(data).toEqual({ name:'something', value: 123, previousValue: 456 });
        done();
      });

      dialogue.getContent()
    });

    it('remove listener', (done) => {
      const content = parse('Hi!{ set something = 123 }\n');
      const dialogue = Interpreter(content);

      const callback = dialogue.on(EventType.VARIABLE_CHANGED, () => {
        throw new Error('should not have triggered listener');
      });

      dialogue.off(EventType.VARIABLE_CHANGED, callback);

      dialogue.getContent()

      setTimeout(() => done(), 100);
    });

    it('trigger dialogue event', (done) => {
      const content = parse('Hi!{ trigger some_event }\n');
      const dialogue = Interpreter(content);

      dialogue.on(EventType.EVENT_TRIGGERED, (data: any) => {
        expect(data).toEqual({ name:'some_event' });
        done();
      });

      dialogue.getContent()
    });

    it('trigger standalone dialog event', (done) => {
      const content = parse('{ trigger some_event }\n');
      const dialogue = Interpreter(content);

      dialogue.on(EventType.EVENT_TRIGGERED, (data: any) => {
        expect(data).toEqual({ name:'some_event' });
        done();
      });

      dialogue.getContent()
    });
  });

  describe('persistence', () => {
    it('get all data and start new instance with right state', () =>{
      const content = parse(`
* a
  Hi!{ set someVar = 1 }
* b
  hello %someVar%
`);
      const dialogue = Interpreter(content);

      expect(dialogue.getContent()).toEqual({ type: 'options', options: [{ label: 'a' }, { label: 'b' }] });
      dialogue.choose(0);
      expect((dialogue.getContent() as DialogueLine).text).toEqual('Hi!');

      const newDialogue = Interpreter(content, dialogue.getData());

      expect(newDialogue.getContent()).toEqual({ type: 'options', options: [{ label: 'b' }] });
      newDialogue.choose(0);
      expect((newDialogue.getContent() as DialogueLine).text).toEqual('hello 1');
    });

    it('get all data and load in another instance', () =>{
      const content = parse(`
* a
  set as 1!{ set someVar = 1 }
* b
  set as 2!{ set someVar = 2 }
result is %someVar%
`);
      const dialogue = Interpreter(content);
      const anotherDialogue = Interpreter(content);

      expect(dialogue.getContent()).toEqual({ type: 'options', options: [{ label: 'a' }, { label: 'b' }] });
      expect(anotherDialogue.getContent()).toEqual({ type: 'options', options: [{ label: 'a' }, { label: 'b' }] });
      dialogue.choose(0);
      anotherDialogue.choose(1);
      expect((dialogue.getContent() as DialogueLine).text).toEqual('set as 1!');
      expect((anotherDialogue.getContent() as DialogueLine).text).toEqual('set as 2!');

      anotherDialogue.loadData(dialogue.getData());

      expect((anotherDialogue.getContent() as DialogueLine).text).toEqual('result is 1');
    });


    it('make sure options are right when loading previously stringified data', () =>{
      const content = parse(`
* a
  set as 1!{ set someVar = 1 }
* b
  set as 2!{ set someVar = 2 }
result is %someVar%
`);
      const dialogue = Interpreter(content);
      const anotherDialogue = Interpreter(content);
      expect(dialogue.getContent()).toEqual({ type: 'options', options: [{ label: 'a' }, { label: 'b' }] });
      dialogue.choose(0);

      const stringifiedData = JSON.stringify(dialogue.getData());
      anotherDialogue.loadData(JSON.parse(stringifiedData));

      expect(anotherDialogue.getContent()).toEqual({ type: 'options', options: [{ label: 'b' }] });
    });


    it('clear all data', () =>{
      const content = parse(`
Hi!{ set someVar = 1 }
hello %someVar%
`);
      const dialogue = Interpreter(content);

      expect((dialogue.getContent() as DialogueLine).text).toEqual('Hi!');
      dialogue.clearData();
      expect((dialogue.getContent() as DialogueLine).text).toEqual('hello ');
    });

    it("changing block order does not impact options persistence", () => {
      const block1 = `
== block_1
* option 1
  line 1
* option 2
  line 2
`;
      const block2 = `
== block_2
* option 1
  line 1
* option 2
  line 2
`;

      const content = parse(block1 + block2);
      const invertedContent = parse(block2 + block1);

      const dialogue = Interpreter(content);
      dialogue.start("block_1")
      dialogue.getContent();
      dialogue.choose(0);

      const data = dialogue.getData();

      const invertedDialogue = Interpreter(invertedContent);
      invertedDialogue.loadData(data);
      invertedDialogue.start("block_1")
      const block1Options = invertedDialogue.getContent();
      invertedDialogue.start("block_2")
      const block2Options = invertedDialogue.getContent();


      expect(block1Options).toEqual({ type: 'options', options: [{ label: 'option 2' }] });
      expect(block2Options).toEqual({ type: 'options', options: [{ label: 'option 1' }, { label: 'option 2' }] });
    });
  });

  describe('End of dialogue', () => {
    it('get end return when not more lines left', () => {
      const content = parse('Hi!\n');
      const dialogue = Interpreter(content);
      expect(dialogue.getContent()).toEqual({ type: 'line', text: 'Hi!' });
      expect(dialogue.getContent()).toEqual({ type: 'end' });
      expect(dialogue.getContent()).toEqual({ type: 'end' });
    });
  });

  describe('Translation', () => {
    it('define dictionary and bring keys from it when available', () => {
      const dictionary = {
        abc: 'this is a replacement',
        ghi: 'replaced',
        jkl: 'replaced 2',
        mno: 'replaced 3',
      };

      const content = parse(`
This will not be replaced
This should be replaced $abc
This will not be replaced either $def
replace $ghi
  * replace $jkl
    <-
(
  -replace $mno
)
`);
      const dialogue = Interpreter(content, undefined, dictionary);
      expect((dialogue.getContent() as DialogueLine).text).toEqual('This will not be replaced');
      expect((dialogue.getContent() as DialogueLine).text).toEqual('this is a replacement');
      expect((dialogue.getContent() as DialogueLine).text).toEqual('This will not be replaced either');
      expect(dialogue.getContent()).toEqual({ id: 'ghi', type: 'options', name: 'replaced', options: [{ id: 'jkl', label: 'replaced 2' }]});
      dialogue.choose(0);
      expect((dialogue.getContent() as DialogueLine).text).toEqual('replaced 3');
    });

    it('load dictionaries on runtime', () => {
      const dictionaryFR  = { abc: 'Bonjour' };
      const dictionaryES  = { abc: 'Hola' };
      const dictionaryPT  = { abc: 'Olá' };

      const content = parse(`Hello $abc\n`);
      const dialogue = Interpreter(content, undefined);
      expect((dialogue.getContent() as DialogueLine).text).toEqual('Hello');
      dialogue.start();
      dialogue.loadDictionary(dictionaryFR);
      expect((dialogue.getContent() as DialogueLine).text).toEqual('Bonjour');
      dialogue.start();
      dialogue.loadDictionary(dictionaryES);
      expect((dialogue.getContent() as DialogueLine).text).toEqual('Hola');

      dialogue.start();
      dialogue.loadDictionary(dictionaryPT);
      expect((dialogue.getContent() as DialogueLine).text).toEqual('Olá');
    });

    describe('id suffixes', () => {
      const dictionary = {
        'abc': 'simple key',
        'abc&P': 'simple key with suffix 1',
        'abc&P&S': 'simple key with suffix 1 and 2',
        'abc&S': 'simple key with only suffix 2',
      };

      const initializeDialogue = () => {
        const content = parse('This should be replaced $abc&suffix_1&suffix_2');
        return Interpreter(content, undefined, dictionary);
      };

      it('returns key with suffix value', () => {
        const dialogue = initializeDialogue();
        dialogue.setVariable("suffix_1", "P");
        expect((dialogue.getContent() as DialogueLine).text).toEqual('simple key with suffix 1');
      });

      it('returns key with multiple suffixes', () => {
        const dialogue = initializeDialogue();
        dialogue.setVariable("suffix_1", "P");
        dialogue.setVariable("suffix_2", "S");
        expect((dialogue.getContent() as DialogueLine).text).toEqual('simple key with suffix 1 and 2');
      });

      it('ignores suffix if variable not set', () => {
        const dialogue = initializeDialogue();
        dialogue.setVariable("suffix_2", "S");
        expect((dialogue.getContent() as DialogueLine).text).toEqual('simple key with only suffix 2');
      });

      it('ignores all suffixes when not set', () => {
        const dialogue = initializeDialogue();
        expect((dialogue.getContent() as DialogueLine).text).toEqual('simple key');
      });

      it('works with options', () => {
        const content = parse(`
first topics $abc&suffix1
  * option 1 $abc&suffix2
    blah
*
  blah $abc&suffix1&suffix2`);
        const dialogue = Interpreter(content, undefined, dictionary);
        dialogue.setVariable("suffix1", "P");
        dialogue.setVariable("suffix2", "S");
        const firstOptions = dialogue.getContent() as DialogueOptions;
        expect(firstOptions.name).toEqual('simple key with suffix 1');
        expect(firstOptions.options[0].label).toEqual('simple key with only suffix 2');

        dialogue.choose(0);
        dialogue.getContent();

        const secondOptions = dialogue.getContent() as DialogueOptions;
        expect(secondOptions.options[0].label).toEqual('simple key with suffix 1 and 2');
      });
    });

    it('external variables should not be included in final data', () =>{
      const content = parse(`
Hi!{ set @someVar = 1, someOtherVar = 2 }
`);
      const dialogue = Interpreter(content);

      dialogue.setExternalVariable("yet_another_var", 3);

      expect((dialogue.getContent() as DialogueLine).text).toEqual('Hi!');
      expect(dialogue.getData()).toEqual(expect.objectContaining({
        variables: {
          someOtherVar: 2,
        }
      }));
    });
  });

  describe('Unknowns', () => {
    it('fails when unkown node type detected', () => {
      const content = parse('Hi!\n') as any;
      content.type = 'SomeUnkownNode';
      const dialogue = Interpreter(content);

      expect(() => dialogue.getContent()).toThrow(/Unkown node type "SomeUnkownNode"/);
    });
  });

  describe('Interpreter Options', () => {

    it('sets id suffixes separators', () => {
      const dictionary = {
        'abc': 'should not use this one. Without suffix',
        'abc&P': 'should not use this one. Default suffix separator.',
        'abc__P': 'use this one',
      };
      const content = parse('This should be replaced $abc&suffix_1');

      const dialogue = Interpreter(content, undefined, dictionary, { idSuffixLookupSeparator: '__' });
      dialogue.setVariable("suffix_1", "P");

      expect((dialogue.getContent() as DialogueLine).text).toEqual('use this one');
    });
  });
});


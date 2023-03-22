# fluree-editor
A React code editor component for Fluree JSON-LD.

You know what to do, just `npm i` then `npm run dev`. ¯\\_(ツ)_/¯

Demo: https://johncrowley-s2.github.io/fluree-editor/

This code is in the early stages of development so everything can and most likely will change...

The `Editor.tsx` component itself is pretty dumb... It consists of a `pre` with a `textarea` overlaid exactly on top of it. The `textarea` has it's font color set to transparent so only the text caret is visible. As long as the content in the textarea overlays precisely with the `innerText` of the `pre`, it appears to the user that they are typing directly into the formatted `pre` element. This approach was inspired by satya164's "react-simple-code-editor" package (https://www.npmjs.com/package/react-simple-code-editor).

Most of the magic happens in the props that get passed in to the editor. The `value` and `onValueChange` props work like any other controlled React component. The `render` prop (which probably needs a better name to avoid confusion with the React concept of "render props") should return an html string which will get rendered into the `pre`. **It is up to the consumer of the `Editor` component to ensure that the text content lines up perfectly!!**. I may change this to render JSX instead of html or to handle both cases, idk. JSX would be more powerful, and might be more performant thanks to React's reconciliation/diffing process, but would make the code a little less portable since JSX kinda locks one into the React ecosystem. More research is needed.

The "lib" folder contains a basic JSON lexer which splits the input string into an array of tokens. Currently this code only performs lexical analysis and emits errors for invalid tokens, but semantic analysis is coming soon!

Currently there is an effect in `App.tsx` which handles showing a "tooltip" (once again a better name is needed) when you hover over a JSON-LD reserved keyword. This was put there for demo purposes; I plan to make a better system for displaying tooltips, hints, auto-complete suggestions, and other intellisense.
UPDATE 3/22/23 Autocomplete is now a work-in-progress.

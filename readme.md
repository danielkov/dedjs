# DedJS Readme

You can use this module on your local machine to try to detect dead code. It is very basic, in that all it does is log and store function calls to its API.

## How does it help?

If you suspect some code is dead (a.k.a.: not in use anymore) you can add `ded.js` to the top of the HTML and then initialize it. This will create reports that you can view on your local machine and see if any of the suspected code chunks receive hits. If they do, it gets reported, because it means that the code you've been suspecting dead is very much alive.

## API

To initialize DedJS, you can install it locally or globally via `npm`.

```sh
npm i -g dedjs
```

If you've installed it globally, you can start by running:

```sh
dedjs
```

Optionally you can also pass in a number afterwards as an argument, which will determine what port the application will use. In any case, the port in use will be logged out to you on the console.

Then in your code you can add this line to suspiciously dead-looking code.

```js
let ded = new DedJS('http://localhost:3000', 'puppiesPage')
function zombie (arg, another) {
  rise()
  eatBrains()
  // TODO: Check if these functions are even being used.
  ded.mark() // No worries, I've marked it for testing.
}
```

Then you can iterate through all your website, trying to hit as many functions as you can. Click everywhere, make sure you're thorough. In the console, you'll get a link, which you can click, or alternatively, go to `http://localhost:<port>` to view your reports.

### Warning

This application does not persist data at the moment. Make sure you run all the tests you need and in the end, remove all marks that are no longer needed.

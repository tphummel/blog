---
layout: post
title: Firebase with NPM + Browserify
tags: [code]
---

Firebase [recently announced](https://www.firebase.com/blog/2014-05-13-introducing-firebase-hosting.html) static client web application hosting. This allows client-only apps which work directly with the firebase data and auth apis. The possibilities are very broad. Here is how I quickly got up and running.

I start new browser apps with a client starter [repo](https://github.com/tphummel/node-bify-app) which contains some handy build scripts based on substack's task automation [post](http://substack.net/task_automation_with_npm_run):

    git clone https://github.com/tphummel/node-bify-app.git my-app
    cd my-app
    rm -rf .git/
    git init

** warning: contains coffeescript

You could also use a tool like [beefy](https://www.npmjs.org/package/beefy) to quickly set up local browserify development.

Before getting into firebase, you can see our dev setup in action with:

    npm install
    npm run dev
    open http://localhost:7007

Firebase makes their client scripts available via cdn or with some other package manager that isn't [NPM](https://www.npmjs.org/). But with a little looking I saw [@flipside](https://github.com/flipside) had already forked [both](https://github.com/tinj/firebase-client) [scripts](https://github.com/tinj/firebase-simple-login) to add browserify/npm compatibility.

Add these two lines to `./package.json` under `dependencies` and rerun `npm install`:

    "firebase-client": "tinj/firebase-client",
    "firebase-simple-login": "tinj/firebase-simple-login"

From here, we can see both scripts in action with a few lines added to `lib/entry.coffee`:

Note: you'll need to have created an app on [firebase.com](http://firebase.com) and have enabled anonymous authentication in the project web console for this next bit to work. See the firebase docs for more detail.

{% highlight coffeescript %}
...

Firebase = require 'firebase-client'
FirebaseSimpleLogin = require 'firebase-simple-login'

dbRef = new Firebase 'https://your-app-name.firebaseIO.com/'

authStateChanged = (err, user) ->
  console.error err if err
  if user
    console.log 'user logged in: ', user
  else
    console.log 'logged out'

auth = new FirebaseSimpleLogin dbRef, authStateChanged
auth.login 'anonymous'

dbRef.on 'value', (snapshot) -> console.log 'heard value', snapshot
dbRef.set 'hello world!', (err) ->
  console.error err if err
  console.log 'set a value!'
{% endhighlight %}

Save `lib/entry.coffee` and the watch script will automatically rebuild the browserify bundle. Reload your browser window and you should see logging for the api activity in the browser console.

Additionally, if the `set` command succeeded above, you should be able to see an entry in the firebase web console under the "data" tab that reads "hello world!".

To host this project with firebase, first we need the firebase cli tools: `npm install -g firebase-tools`. After that, you should have the `firebase` command available in your terminal.

Next run `firebase init` in the project root. Choose the firebase app name for this project. Then, for the app public directory use `build/` since that is where our compiled html and javascript gets written. Once this is done, you'll see a `firebase.json` file was created in the project root. Now run `firebase deploy`. You'll see terminal output and if everything went correctly, `firebase open` will open the deployed app in your default browser.

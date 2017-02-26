---
layout: post
title: Going From Zero to Node.js
tags: [javascript, code]
---

Some friends of mine wanted to mess around with programming. They have an apple laptop and zero experience. I think Node.js is a good platform for beginners because of the ubiquity of javascript on the web today and the great tooling and resources for getting started.

### 1. install nodejs

open [nodejs.org](http://nodejs.org/) and click install. This will install both node.js itself and [npm](http://npmjs.org/), the package manager for the node ecosystem.

### 2. open a terminal

Open the terminal app by clicking "Applications", then the subfolder for "Utilities", and finally the icon for "Terminal.app".

Choosing, configuring, and customizing a terminal is an important part of working on software because the terminal is so central to most workflows. However, it is beyond the scope of this writeup so we'll use the default terminal that comes with OSX.

Once the terminal window appears, type `node -v`. If the node.js installation succeeded you should see the version printed. You can see that npm was also installed by running `npm -v`.

### 3. open an editor

Much like the terminal, developers spend a large portion of their time editing text files. Text editors are a personal and sometimes divisive topic across communities. Again, selecting and customizing an editor is outside the scope of what we're doing right now.

A good one to start with would be [textmate](http://macromates.com/download) or [sublime](https://www.sublimetext.com/), or the default editor that comes with OSX, TextEdit, which is available in your "Applications" directory.

These simple editors behave much like the office applications you may already be familiar with. Creating, opening, and saving files is what you will primarily be doing.

### 4. going to school

There are a number of excellent, self-guided lessons or "workshoppers" available at [nodeschool](http://nodeschool.io/). Start with the lesson titled "javascripting". With steps 1, 2, and 3 completed above, we've got everything we need to dive in.

In your terminal, type `npm install -g javascripting` and press `return`. Once that completes, you'll have the `javascripting` command available in your terminal.

Type `javascripting` and press `return`. This will open the lesson menu and list all available tasks. Navigate between tasks with the up and down arrow keys. Press `return` to choose. Each task contains a prompt and requirement to satisfy the task.

Following the javascripting lesson, other essential core lessons include:

- git-it (`npm install -g git-it`)
- learnyounode (`npm install -g learnyounode`)


### 5. make something

With the node.js and git skills from the nodeschool lessons above we have the minimum knowledge necessary to deploy a web app.

Make a new project directory for our application and initialize. `npm init` will ask you for settings but it is fine to press `return` for each of these and accept the defaults.

```
mkdir ~/our-new-web-app
cd ~/our-new-web-app
git init
npm init
```

We're going to create the smallest possible node.js application just in order to see something run. Create a new file named `index.js` in our app folder. In this file, we're going to write our app code:

```
var http = require('http');
var port = process.env.PORT || 3000;

http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  return res.end("Hello! This is our first app\n");
}).listen(port);

console.log("app running on port", port);
```

This http server should look familiar from the front page of [nodejs.org](http://nodejs.org) and the learnyounode workshopper.

We can see our application running locally by typing `node index` in our terminal from the app directory. Open `localhost:3000` in your browser and we should see the server respond with a message.

Removing complexity and any other barriers is essential at the beginning. For this example we'll use [heroku](http://heroku.com) to see our application running in public.

Go to the [heroku website](https://www.heroku.com/home) and create a new account.

Download the [Heroku Toolbelt](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up). This will give us the tools we need to deploy our app to heroku and make it viewable on the internet.

Type `heroku login` into your terminal and follow the prompts.

One setting we need to update before we can deploy is the start script in `package.json`. Open this file in your editor. And add the following line to the `scripts` object: `"start": "node index",`. The full file should now look like this:

```
{
  "name": "our-new-web-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}

```

This adds the ability to run `npm start` from the app directory, which now maps to the `node index` command we used earlier to run our server locally. This is how heroku will start our application after we deploy.

We are now ready to deploy. Let's add the two files in our project directory to our git repository.

```
git add .
git commit -m "our first commit"
```

Now we can push our git repository to heroku.

```
heroku create
git push heroku master
```

You will see a bunch of activity logging returned by heroku and finally a url where the app is deployed. It will look something like:

```
https://glacial-sierra-6217.herokuapp.com/ deployed to Heroku
```

Open the url in your browser to see your thing!

Seeing results early and often can fuel learning and growth. Hopefully this simple workflow provides that foundation.

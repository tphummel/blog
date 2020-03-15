---
date: 2014-08-13T16:03:13-07:00
draft: false
toc: false
images:
title: JavaScript Inheritance
tags: [javascript, code]
aliases:
  - /2014/08/13/javascript-inheritance/
---

There are [plenty][0] [of][1] [articles][2] [and][4] [docs][5] that describe the differences, strengths, and weaknesses of javascript prototypal inheritance compared to more traditional inheritance schemes in other languages. Goodness knows there are many ways to get it wrong. I saw a new one in a project recently. What happens when you do the following?

```javascript
var Parent = function(){}
var Child = function(){}

// :-/
Child.prototype = new Parent()
```

There was a major bug in this project related to data leaking across multiple instances of the `Child` class. We can see the bug in action if we continue the example above:

```javascript
var child1 = new Child()
var child2 = new Child()

child1.a = "yo"
console.log(child2.a)
// prints "hi" - as I would expect

child1.b.name = "tom"
console.log(child2.b.name)
// prints "tom" - NOT as I would expect
```

Primitive attributes would behave as expected but complex values would be shared across instances when the prototype chain was set up this way.

As for how this *should* have been done, I used [an example from the MDN docs][5] and [node.js' util module][6] as guides.

```javascript
var Parent = function(){}
var Child = function(){
  Parent.call(this)
}

Child.prototype = Object.create(Parent.prototype, {constructor: Child})

```

or using node.js' [util.inherits][7]

```javascript
var util = require("util")

var Parent = function(){}
var Child = function(){
  Parent.call(this)
}

util.inherits(Child, Parent)

```

[0]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain
[1]: https://alexsexton.com/blog/2013/04/understanding-javascript-inheritance/
[2]: https://javascript.crockford.com/prototypal.html
[4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
[5]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Classical_inheritance_with_Object.create
[6]: https://github.com/joyent/node/blob/v0.10.30-release/lib/util.js#L554
[7]: https://nodejs.org/docs/latest/api/util.html#util_util_inherits_constructor_superconstructor

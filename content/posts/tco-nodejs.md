---
date: 2020-07-14T16:03:13-07:00
draft: false
toc: true
title: Node.js Total Cost of Ownership
tags: [javascript, code, node.js]
---

## What? Why?

Node.js is an excellent platform for developer productivity. It can be your swiss army knife for doing asynchronous network and filesystem I/O. You can get started fast and pull in community modules fast to solve the problem at hand.

While developing your program, lowering the total cost of ownership (tco) of and limiting risk exposure to third party modules can help your work achieve stability and continuity.

Taken to the extreme, you would not take any third party dependencies. However, this would fail to take advantage of the hard work and passion of the ecosystem orbiting node.js.

The correct balance in my opinion is to use community modules but choose them with scrutiny and rigor.

Things that increase TCO and associated third party module risk include:

- transitive dependencies
- ever increasing module scope
- low or no test coverage
- no automated style guide
- complicated/superfluous build tools
- unfavorable licenses
- deprecation risk

## Transitive Dependencies

If a dependency you include in your project also has dependencies of its own the exposure to third party libraries could be far larger than you believe.

Know what is in the package.json of your direct dependencies. Put a premium on packages with zero dependencies.

- Best: A module with no dependencies
- Next Best: A module with dependencies, but which has no transitive dependencies.

## Module Scope

Favor modules which have a small, focused scope. If a module declares its featureset "done", this is the best of all. It does what it says it does, it can prove it with tests, and it won't be adding anything else.

Examples: nedb, run-waterfall

## Test Coverage

Modules which can't automatically prove correctness are not worth consideration.

## Automated Style Guide

The `devDependencies` block in package.json is not as quite as important as `dependencies` when it comes to TCO risk. That said, devDependencies for purposes like automating style enforcement is a low effort way to standardize a codebase and avoid wasting energy talking about code style.

see: Standard

## Build Tools

The presence of a tool like webpack, rollup, or babel in an NPM module wouldn't immediately disqualify it. However, it should prompt followup questions about why it is there. If deciding between two modules which fill the same need, all other things equal, choose the one which doesn't use these tools.

## Unfavorable Licenses

If you use a third party library, you are responsible for adhering to the license of that library and all of its third party libraries (your fourth party libraries).

I'm not a lawyer. MIT licenses lower my blood pressure. All others need additional attention.

## Deprecation Risk

Open source is thankless work. Projects rise and fall. People find motivation and struggle with burnout. Priorities change and the industry is always moving.

There have been high profile deprecations of keystone npm modules. [Request](https://www.npmjs.com/package/request) and [Hapi](https://github.com/hapijs/hapi/issues/4111) are two examples. You can't be hurt by the deprecation of a module you don't depend on.

Stay aware of the health of the modules you depend on and be ready to make other plans if a module is withering or reaches end of life. Small scoped modules are easier to replace than frameworks or cure-all modules.

## Related Work

- James Halliday [wrote about useful heuristics for finding npm modules in 2014](https://web.archive.org/web/20140518090110/http://substack.net/finding_modules).

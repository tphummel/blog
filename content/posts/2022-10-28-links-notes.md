---
title: "October 28, 2022: Links and Notes"
date: 2022-10-28T23:05:00-07:00
draft: false
toc: false
tags:
  - links
  - notes
  - casual
  - k8s
---

- [https://beyondloom.com/decker/index.html](https://beyondloom.com/decker/index.html)
    - hypercard. creativity. inspiration. where tech started for me.
- [https://getblogging.org](https://getblogging.org/)
    - just write. own your own space on the web
- [https://quadratic.fm/p/how-meta-microsoft-google-github](https://quadratic.fm/p/how-meta-microsoft-google-github)
    - conditional http requests
- shell goodies
    - [https://sharats.me/posts/shell-script-best-practices/](https://sharats.me/posts/shell-script-best-practices/)
    - [https://github.com/jlevy/the-art-of-command-line](https://github.com/jlevy/the-art-of-command-line)
- [https://www.graalvm.org/2022/openjdk-announcement/](https://www.graalvm.org/2022/openjdk-announcement/)
    - nice
- i love everything in and adjacent to cloudflare workers eco
    - [https://taras.glek.net/post/cloudflare-pages-kind-of-amazing/](https://taras.glek.net/post/cloudflare-pages-kind-of-amazing/)
    - [https://betterprogramming.pub/migrating-a-node-js-app-to-cloudflare-workers-from-heroku-62c679552af](https://betterprogramming.pub/migrating-a-node-js-app-to-cloudflare-workers-from-heroku-62c679552af)
- [https://www.wsj.com/articles/the-first-rule-of-microsoft-exceldont-tell-anyone-youre-good-at-it-1538754380](https://www.wsj.com/articles/the-first-rule-of-microsoft-exceldont-tell-anyone-youre-good-at-it-1538754380)
    - excel, printers, wifi, anything IT related. don’t tell anybody
- [https://slowroads.io/](https://slowroads.io/)
    - pleasing
- [https://aisnakeoil.substack.com/p/students-are-acing-their-homework](https://aisnakeoil.substack.com/p/students-are-acing-their-homework)
    - ai/ml applications get lots of press. they don’t inspire me. i feel inspired to break them rather then help build them. i want to make anti-models which can break or identify the work of other models.
- [https://research.ibm.com/blog/ai-for-code-project-wisdom-red-hat](https://research.ibm.com/blog/ai-for-code-project-wisdom-red-hat)
    - code generation tools like github copilot seem weird to me. code scaffolding, templating, and generation are useful. But sitting down to write code when i’m not sure what i need to write has proven to be a disaster for my entire career. my productivity is not limited by how fast I can type or how much code I can output. increasingly my work results in fewer and fewer lines of code as my career progresses. I need to sit down with pen and paper or my note taking app and organize my thoughts. I don’t need an AI to guess what I need to write. I could be missing the point though.
- [https://erikbern.com/2022/10/19/we-are-still-early-with-the-cloud.html](https://erikbern.com/2022/10/19/we-are-still-early-with-the-cloud.html)
    - breaking free of prior patterns and paradigms sounds good. But i think if you play that out you end up with something like kubernetes - which is interesting software. but the abstractions keep growing and start sucking in everything around them including those things in adjacent layers of the stack - like the vendor specific IaaS details it was "protecting" you from. You look up and the thing doesn’t know what it wants to be anymore or who it is trying to serve. I mostly agree with Corey Quinn’s recent take. I want to get stuff done and k8s is not today the best way to do that. I’m productive when I can write software and deploy it to a cloud vendor - in code, with state of the art tools, on state of the art platforms. i don’t know what tolerances and affinities/anti-affinities i need, or whether to reach for a stateful/replica/daemon set. The problem is if I adopt those abstractions there are too many situations where they leak or break down entirely and I still need to understand my IaaS vendor. You have to understand how the abstractions manifest in reality. What knobs do I need to turn to get a server running three containers that auto-restart on failure? We learned that declarative is better than imperative but you can take it too far. I actually care more than I thought about how my scheduler achieves my declared state. Controller patterns are interesting but they can only know the situations I tell it to know about ahead of time. If I expect more than that I'm not optimistic it will go well. Instead I'm going to declare what I want my end state to look like then show me your imperative plan to achieve that. I don't trust you to figure it out on your own. I'll trust you to handle a precise action we've done 100 times but do not improvise. I took on a new abstraction layer which promised a number of things but now instead of one problem, I have two. I’ll just stick to the lower layer of abstraction until the next one is done cooking - in order to get my work done - then i’ll happily move up a layer once I know I never need to return. Like how I never find myself needing to work with C or network cabling or physical servers anymore. The realities of building, deploying, and operating web services in 2022 provide helpful constraints for creating focus. Without these you are free to reimagine the entire universe and it is scary how big an unbounded abstraction can get. You keep doubling down. If we bolt just one more piece onto the abstraction we'll recoup our costs to date and then start realizing those sweet profits. But this is a cocktail of gamblers falacies - sunk cost, hot hand, [Martingale](https://en.wikipedia.org/wiki/Martingale_(betting_system)). I don't want to play this game. Let me know who wins and I'll be ready to go from there. In the meantime I'm going to work on something else. 
        - see: [https://www.lastweekinaws.com/blog/a-brief-history-of-kubernetes-its-use-cases-and-its-problems/](https://www.lastweekinaws.com/blog/a-brief-history-of-kubernetes-its-use-cases-and-its-problems/)
        - frontend javascript frameworks. vendor-agnostic/multi-cloud iac. if you don't enjoy the journey, wait to see who wins then adopt and continue from there. 

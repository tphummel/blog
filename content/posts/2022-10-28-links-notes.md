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
    - breaking free of prior patterns and paradigms sounds good. But i think if you play that out you get kubernetes - which is interesting software. but the abstractions keep growing and start sucking in everything around them include those things in adjacent layers - like vendor specific IaaS details. You look up and the thing doesn’t know what it wants to be anymore or who it is trying to serve. I mostly agree with Corey Quinn’s recent take. I want to get stuff done and k8s is not today the best way to do that. I’m productive when I can write software and deploy it to a cloud iaas, paas, saas. i don’t know what tolerances and affinities/anti-affinities i need, or whether to reach for a stateful set, a replica set, or a daemon set. The problem is if I adopt those abstractions there are still too many situations where they leak or break down entirely and I still need to understand my IaaS vendor. So now I have two problems. I’ll just stick to the lower layer of abstraction until the next one is done cooking - in order to get my work done - then i’ll happily move up a layer once I know I never need to return.
        - also: [https://www.lastweekinaws.com/blog/a-brief-history-of-kubernetes-its-use-cases-and-its-problems/](https://www.lastweekinaws.com/blog/a-brief-history-of-kubernetes-its-use-cases-and-its-problems/)

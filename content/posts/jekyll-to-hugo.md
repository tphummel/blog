---
date: 2020-03-14T16:03:13-07:00
draft: false
toc: true
images:
title: Migrating from Jekyll to Hugo
tags: [blog,static-site,jekyll,hugo]
---

## Problem

I wanted to update the look and feel of this blog and focus the content more specifically on technology.

## Why not Jekyll?

Since moving this blog from a [php website in 2011][1] to a completely static build using [jekyll][0] in [2012][2], I've steadily been losing expertise on how to use Jekyll effectively. I no longer have a working development environment for running Jekyll. All I have is a working configuration in [travis ci][3].

My workflow involved writing markdown locally, viewing a local rendering of the markdown in my editor (which wasn't styled like my blog at all), commit, push, open PR, then merging my pull request on github, and hoping for the best. It still worked for the most part, until it didn't. It broke for a moment early in 2020 which underscored how flaky the publishing process had become. The prospect of re-learning enough about ruby and jekyll was enough to force considering alternatives.

## Why Hugo?

At a high level, Hugo and Jekyll have roughly equivalent features. What could justify switching from one to the other?

I've been using Hugo heavily for [two][5] [other][6] projects in the years since 2012. I've already paid down the cost of switching tools. While I'm not a go developer, I've gotten very familiar with go templates which are used by Hugo.

Hugo is installed by downloading one executable binary file which drastically simplifies setting up a development environment and your ci/cd tool.

## Which Theme?

I evaluated several off the shelf hugo themes. Discovery of these is easy using either [hugo's website][7] or [github topics][8]:

- https://github.com/forestryio/novela-hugo-starter
- https://github.com/luizdepra/hugo-coder
- https://github.com/Track3/hermit
- https://github.com/panr/hugo-theme-terminal
- https://github.com/nanxiaobei/hugo-paper
- https://github.com/panr/hugo-theme-hello-friend
- https://github.com/nodejh/hugo-theme-cactus-plus
- https://github.com/yihui/hugo-xmin

In evaluating themes, i also ran across a [helpful article][9] on migrating from jekyll to hugo.

### First Choice

I started with choosing a [hugo port of Hermit][16]. The theme includes support for [Subresource Integrity][17] for stylesheets and javascript files, which is really cool. However, I ran into an issue with [Cloudflare][18] CDN, in which the hash of the files changed between build time and when the files were served. The hash of the file didn't match the hash in the built website which caused loading the stylesheet to fail in modern browsers which support the SRI recommendation.

I evaluated the options in the free tier of cloudflare's CDN and couldn't find anything to fix or customize the issue. If I turned off the CDN cache altogether, allowing requests to flow directly to the origin, SRI would be succeed.

In researching SRI further, it really wasn't meant for my usecase, where a stylesheet was being served from my own site. It is meant to prevent an XSS attack when loading a common library from a public CDN you don't control. It is meant to ensure the content of the file you are loading was not changed or compromised.

I considered forking/contributing to the theme. This was and would be an interesting side quest, but in the end I decided to abort in the interest of time.

### Second Choice

I switched to [hello friend ng][19] which is very similar to [Hermit][16] but chose not to implement SRI.

## Key Migration Points

Several areas within my existing Jekyll site would need to be changed to match Hugo's way of doing things. I wanted the project to become canonical Hugo rather than customizing Hugo to use my existing jekyll site structure. This would more closely match my other Hugo projects and reduce overhead moving between them.

### Site Config

This is obvious, but Jekyll and Hugo use different site configuration files. [Jekyll Config][11] vs. [Hugo Config][12]

### CI Config

Tooling changes required a number of tweaks to my [.travis.yml][13].

The [CI metadata file][15] built using the project's [Makefile][14] needed a small tweak to use the default build directory for Hugo (`public/`), instead of that of Jekyll (`_site/`).

### Post Frontmatter

from:
```
---
layout: post
title: Things I Look Up
tags: [reference]
---
```

to:

```
---
title: "Things I Lookup"
date: 2020-02-14T16:03:13-07:00
draft: false
toc: true
images:
tags: [reference]
aliases:
  - /2020/02/14/things-i-lookup/
---
```

### Post References

from:
```
{% post_url 2011-01-01-tetris-primer %}
```

to:
```
{{</* ref tetris-primer */>}}
```


### Instagram Embeds

from: html literal

to:
```
{{</* instagram BelDGZQHVaz hidecaption */>}}
```

### Twitter Embeds

from: html literal

to:

```
{{</* tweet 858732773586030593 */>}}
```

### Data Driven Posts

I had local csv files checked into the repo, which I used to generate tables for a particular post. I went to the currently published posts, copied the rendered html, and converted the html to markdown using an [online tool][20]. This was a one-time conversion related to the migration. The data doesn't update.

from:

```
<table class="table"><tbody>
<tr>
  {% for head in site.data.mkdd_global_course_dist[0] %}
    <th>{{ head[0] }}</th>
  {% endfor %}
</tr>
{% for row in site.data.mkdd_global_course_dist %}
  <tr>
  {% for cell in row %}
    <td>{{ cell[1] }}</td>
  {% endfor %}
  </tr>
{% endfor %}
</tbody></table>
```

to:

```
|Course|Race Count|
|--- |--- |
|Luigi Circuit|37|
|Peach Beach|37|
|Baby Park|554|
|Dry Dry Desert|37|
|Mushroom Bridge|37|
|Mario Circuit|37|
|Daisy Cruiser|36|
|Waluigi Stadium|36|
|Sherbet Land|36|
|Mushroom City|36|
|Yoshi Circuit|36|
|DK Mountain|36|
|Wario Colosseum|37|
|Dino Dino Jungle|37|
|Bowser Castle|36|
|Rainbow Road|36|
```

### Posts Directory and Filenames

from:
```
_posts/2011-01-01-tetris-primer.md
```

to:
```
content/posts/tetris-primer.md
```

  [0]: https://jekyllrb.com/
  [1]: https://web.archive.org/web/20110704022905/http://tomhummel.com/
  [2]: https://github.com/tphummel/blog/commit/2f94eeee423ae2385f0628e3cad76100549f3bec
  [3]: https://travis-ci.com/
  [4]: https://gohugo.io
  [5]: https://github.com/lapsrun/laps.run
  [6]: https://github.com/tphummel/data.tomhummel.com
  [7]: https://themes.gohugo.io/
  [8]: https://github.com/topics/hugo-theme?o=desc&s=stars
  [9]: https://hugothemes.gitlab.io/mainroad/post/migrate-from-jekyll/
  [10]: https://github.com/lapsrun/laps.run/blob/master/bin/deploy-preview-site.sh
  [11]: https://github.com/tphummel/blog/commit/17b813c8c981d5915fecd5d207de2c264bde2fbb#diff-aeb42283af8ef8e9da40ededd3ae2ab2
  [12]: https://github.com/tphummel/blog/blob/1ad3d9e24449557e2f710faf1c8353bd30607b9e/config.toml
  [13]: https://github.com/tphummel/blog/commit/17b813c8c981d5915fecd5d207de2c264bde2fbb#diff-354f30a63fb0907d4ad57269548329e3
  [14]: https://github.com/tphummel/blog/commit/17b813c8c981d5915fecd5d207de2c264bde2fbb#diff-b67911656ef5d18c4ae36cb6741b7965
  [15]: https://tomhummel.com/ci.json
  [16]: https://github.com/Track3/hermit
  [17]: https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
  [18]: https://cloudflare.com
  [19]: https://github.com/rhazdon/hugo-theme-hello-friend-ng
  [20]: https://jmalarcon.github.io/markdowntables/

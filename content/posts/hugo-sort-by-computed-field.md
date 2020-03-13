---
title: "Sort by Computed Field in Hugo"
date: 2018-10-04T16:03:13-07:00
draft: false
toc: true
images:
tags:
  - hugo
  - static-site
---

## Goal

In a [hugo](https://gohugo.io/) [static site](https://laps.run), sort a list of content by a computed field - a field not set explicitly in a page's frontmatter.

Page front matter which looks like this:

```
---
title: "Post No. 3"
date: 2018-10-01T20:53:20-07:00
distance_miles: 21.77
time_minutes: 5
---
```

I wanted to divide `distance_miles` by `time_minutes` and then sort my pages by that.

## Sorting

There is plenty of documentation on how to [order content](https://gohugo.io/templates/lists/#order-content), and also how to [sort data structures](https://gohugo.io/functions/sort/) in Hugo. Hugo's documentation is generally excellent. There is also a very active [discourse](https://discourse.gohugo.io/) with lots of question and answer content.

You can get a range of pages sorted by common metadata like [last modified date](https://gohugo.io/templates/lists/#by-last-modified-date), [title](https://gohugo.io/templates/lists/#by-title), or [length](https://gohugo.io/templates/lists/#by-length). And you can also [sort by arbitrary parameters](https://gohugo.io/templates/lists/#by-parameter) in your content front matter.

However, none of these usages were what I needed. I wanted to compute a dynamic value based on some static values in page front matter, then sort the list of pages by the computed value.

## Scratch

Most complex things in Hugo I've found can be solved with [scratch](https://gohugo.io/functions/scratch). There is a [page](https://regisphilibert.com/blog/2017/04/hugo-scratch-explained-variable/) linked from the hugo docs which does a very exhaustive look at the scratch feature.

[One particular comment](https://discourse.gohugo.io/t/order-data-files-by-secondary-parameter/6407/10) on discourse unlocked the usage of scratch I was looking for. The problem in that thread is not an exact match of mine, but it showed a very clever scratch usage.

## Solution

My [list template](https://github.com/tphummel/laps.run/blob/order-by-computed-poc/order-by-computed-poc/layouts/_default/list.html) renders an HTML table with a row per page. I'll cover the key parts of the solution.

My speed calculation:

```
$speed := div .Params.distance_miles .Params.time_minutes
```

My intermediate structure to hold all pages, each with a computed speed value:

```
$.Scratch.Add "enriched" (slice (dict "page" . "speed" $speed))
```

As we iterate over each page in my site, I compute the `$speed` value and then assemble a [slice](https://gohugo.io/functions/slice/) of [dicts](https://gohugo.io/functions/dict/). Each dict in the slice has two fields: `page` and `speed`. Page holds the entire page object so we can access it later once we've sorted the slice. More information on the context dot `.` can be found on [another excellent post](https://regisphilibert.com/blog/2018/02/hugo-the-scope-the-context-and-the-dot/).

Then we range over the sorted slice:

```
range sort ($.Scratch.Get "enriched") ".speed" "desc"
```

This `($.Scratch.Get "enriched")` accesses the slice containing all of the dicts we built above. And we are sorting by a field on the dict `.speed`, which contains the computed speed value.

## Appendix

[example code](https://github.com/tphummel/laps.run/tree/order-by-computed-poc/order-by-computed-poc)

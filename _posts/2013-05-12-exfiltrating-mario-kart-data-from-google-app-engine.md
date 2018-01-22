---
layout: post
title: Exfiltrating Mario Kart Data from Google App Engine
tags: [code, kart, video-games]
---

In our most recent [Mario Kart][3] multiplayer session, there was a data error in which one round didn't save correctly. If this happens in [tetris][0] it is a non-issue as I just go into sql and correct it (normally user error). The data for Mario Kart however is stored in the Google App Engine datastore. This data is very cumbersome to query and update by comparison.

So in short I think it is time to get the data out of there. Something I've been dreading since this data mess-up happened, way back on Feb 17, 2013.

Last i remember, using the bulk downloader is awkward. So I think it will be faster to deploy a JSP that will dump out the data in json.

In doing this, I realized that I haven't deployed any code to GAE since 2011. I no longer have the windows machine I last pushed from. I'm going to need to recreate my dev environment on OSX. So this should be interesting.

I found some application called GoogleAppEngineLauncher that is installed on my Mac. I have python 2.6 and apparently 2.7 is required.

{% highlight sh %}
sudo brew install python
{% endhighlight %}

I feed the new python 2.7 binary into the app preferences. none of this is ringing a bell.

Okay. I don't think i ever used GoogleAppEngineLauncher with java projects. Backpedaling, I see I have Eclipse installed from when i was trying some Android dev. Never installed the GAE SDK though. I now remember this how I used to develop and deploy java apps on windows though.

Some docs i found useful:

- [getting started with GAE/J][4]
- [GAE/J with eclipse][5]
- [getting an existing GAE/J project into eclipse][6]

Then import my project.

{% highlight sh %}
git clone https://github.com/tphummel/gaej-kart
{% endhighlight %}

then in Eclipse: menu > file > import

Eclipse shows red errors everywhere that external jar files are being used. Spin open ```{proj_root}/war/WEB-INF/lib```. Select all jar files, right-click, Build Path > add to path

menu > debug as > web application

Loud failure! It says I need to add ```threadsafe: true``` to my app.yaml file.

menu > debug as > web application

And we're up on ```localhost:8888```. In my browser I try to load ```/app/home``` after passing through the local auth shim and it blows up.

Eclipse is showing an error. It was from before I got the local server up. Apparently not bad enough to prevent building.

{% highlight sh %}
Unbound classpath container: 'App Engine SDK [missing]'....
{% endhighlight %}

Right-click the project folder and go to Build Path > Configure Build Path. In the Libraries tab I can see the list of files/dirs in my project build path. i can see all my external jars, the app engine sdk, and my system jre. but there is also a second app engine sdk entry which is red and says "unbound" or some such nonsense. I remove that one. relaunch the project and now /app/home loads correctly. whew.

Now i got it running, i want a JSP that takes one param, the collection name. Then queries the datastore, json stringifies, and dumps everything to the page.

After two attempts ([using Extent and using the JDO cursor][8]) I can't seem to query any data. What's worse is all existing pages that rely on data from the datastore give me an error now.

In some cases I get a 500 error with this text:

{% highlight sh %}
This means that it either hasnt been enhanced, or that the enhanced version of the file is not in the CLASSPATH (or is hidden by an unenhanced version), or the Meta-Data/annotations for the class are not found.
{% endhighlight %}

Ok. I think GAE has changed pretty drastically while I've been away. I'm sure the act of pushing alone has broken the app beyond saving at this point. I just need to get the data out.

Looks like my only option is down to [appcfg.py bulkloader][9] ...

Thank my lucky stars I'm able to deploy and get ```/remote_api``` working. I'm actually shocked that works for me at this point.

The one tricky part about customizing the auto-generated ```bulkoader.yaml``` is dealing with the nested key objects which I used for primary keys and in a couple places as foreign keys. I found some [good][12] [links][10] on how to transform deep keys into their constituent pieces. My [final result][13] worked nicely.

And just like that I have the [data][14] out. I wish I had just started with appcfg.py from the beginning. There were 1101 total races made up of 3248 individual performances.

I think the lesson here is that if I'm going to use a PaaS I can't create something, walk away from it for two years, and expect everything to be peachy when I try to make a change (however small I may think it is). And I don't think I will be choosing to use Java anytime soon, given the option. All the same adios GAE we had a good run.

  [0]: /2011/01/01/tetris-primer/
  [3]: /2011/01/01/mario-kart-primer/
  [4]: https://developers.google.com/appengine/docs/java/gettingstarted/installing
  [5]: https://developers.google.com/appengine/docs/java/tools/eclipse
  [6]: https://developers.google.com/eclipse/docs/existingprojects
  [7]: https://developers.google.com/appengine/docs/java/configyaml/appconfig_yaml
  [8]: https://developers.google.com/appengine/docs/java/datastore/jdo/queries
  [9]: https://developers.google.com/appengine/docs/python/tools/uploadingdata
  [10]: http://stackoverflow.com/questions/11542669/google-app-engine-bulkloader-deep-key
  [12]: http://stackoverflow.com/questions/6817626/where-are-the-reference-pages-of-the-google-app-engine-bulkloader-transform
  [13]: https://github.com/tphummel/gaej-kart/blob/master/script/data/bulkloader.yaml
  [14]: https://github.com/tphummel/gaej-kart/tree/master/script/data/csv

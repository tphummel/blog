---
layout: post
title: Found Facts
tags: [qs]
---

Everyday we leave a wake of data behind us. Generally, you would assume this data is digital: things like pageviews, dns queries, retweets. Data thrown off by the actions we take each day within the communities we belong to.

But people also leave a wake of physical data behind them, usually by accident.

<blockquote class="twitter-tweet" data-lang="en"><p lang="und" dir="ltr"><a href="https://t.co/X0g4TnTGj2">pic.twitter.com/X0g4TnTGj2</a></p>&mdash; Found Fact (@FoundFact) <a href="https://twitter.com/FoundFact/status/858732773586030593">April 30, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Sales slips are extremely dense in information. Let's look at all of the things we can learn.

Somebody with a Visa card ending in 0723 paid $17.99 to have their car washed at [Overland Car Wash](https://www.yelp.com/biz/overland-car-wash-and-detail-center-los-angeles) on Monday April 3, 2017 at 2:15 PM.

I found the receipt littered on the street at [34.0224730, -118.4203630](https://www.google.com/maps/place/34%C2%B001'20.9%22N+118%C2%B025'13.3%22W/@34.022473,-118.4225517,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d34.022473!4d-118.420363) while I was out walking my dogs on April 30, 2017 at 10:20 AM.

<iframe src="https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d6613.714484861466!2d-118.41828897393405!3d34.021875172456625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e6!4m5!1s0x80c2ba31abdc156b%3A0x963db1f135cfe41a!2sOverland+Car+Wash+and+Detail+center%2C+Overland+Avenue%2C+Los+Angeles%2C+CA!3m2!1d34.0196614!2d-118.40728039999999!4m3!3m2!1d34.022473!2d-118.420363!5e0!3m2!1sen!2sus!4v1493582552582" width="600" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>

After the transaction occurred, the receipt then travelled 1.1 miles over the next 26 days, 20 hours, and 5 minutes until I found it.

Looking at the sales slips, there is a bunch of information embedded in it. Googling for some of the codes we can see, the top-most receipt appears to have come from a [Casio point of sale machine](http://support.casio.com/storage/en/manual/pdf/EN/006/QT-6000_EN.pdf). `MC #01` indicates this is either the only POS machine they have, or it is the first of N machines. `517773` appears to be an auto-incremented transaction number. At the time of this transaction, there has been 517,773 transactions at this location (or since they put in this POS system).

There are two timestamps, one on each of the two slips. There is ~4 minutes between them. I would guess this represents the time it took after receiving the claim check and when the credit card transaction was completed.

The customer scanned the card's chip rather than swiping the magnetic strip. There is a transaction # on the credit card slip (`065`). I wonder how often that resets, probably daily? That would indicate they don't do over 999 credit card transactions in a single day or on a single machine.

[ACI code "E"](http://cdn.nsoftware.com/help/BC6/cs/pg_retacicodes.htm) appears to indicate the cardholder signed for the transaction.

## Summary

There is information swirling around us, everywhere we go. Sometimes it takes the form of radio waves and sometimes it is a physical piece of paper under your shoe.

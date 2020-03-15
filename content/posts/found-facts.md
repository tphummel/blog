---
title: "Found Facts"
date: 2017-04-30T16:03:13-07:00
draft: false
toc: false
images:
tags:
  - qs
aliases:
  - /2017/04/30/found-facts/
---

Everyday we leave a wake of data behind us. Generally, you would you would assume this data is digital: things like pageviews, dns queries, retweets. Data thrown off by the actions we take each day within the communities we belong to.

But people also leave a wake of physical data behind them, usually by accident.

{{< tweet 858732773586030593 >}}

Sales slips are extremely dense in information. Let's look at all of the things we can learn.

Somebody with a Visa card ending in 0723 paid $17.99 to have their car washed at [Overland Car Wash](https://www.yelp.com/biz/overland-car-wash-and-detail-center-los-angeles) on Monday April 3, 2017 at 2:15 PM.

I found the receipt littered on the street at [34.0224730, -118.4203630](https://www.google.com/maps/place/34%C2%B001'20.9%22N+118%C2%B025'13.3%22W/@34.022473,-118.4225517,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d34.022473!4d-118.420363) while I was out walking my dogs on April 30, 2017 at 10:20 AM.

After the transaction occurred, the receipt then travelled 1.1 miles over the next 26 days, 20 hours, and 5 minutes until I found it.

Looking at the sales slips, there is a bunch of information embedded in it. Googling for some of the codes we can see, the top-most receipt appears to have come from a [Casio point of sale machine](http://support.casio.com/storage/en/manual/pdf/EN/006/QT-6000_EN.pdf). `MC #01` indicates this is either the only POS machine they have, or it is the first of N machines. `517773` appears to be an auto-incremented transaction number. At the time of this transaction, there has been 517,773 transactions at this location (or since they put in this POS system).

There are two timestamps, one on each of the two slips. There is ~4 minutes between them. I would guess this represents the time it took after receiving the claim check and when the credit card transaction was completed.

The customer scanned the card's chip rather than swiping the magnetic strip. There is a transaction # on the credit card slip (`065`). I wonder how often that resets, probably daily? That would indicate they don't do over 999 credit card transactions in a single day or on a single machine.

[ACI code "E"](http://cdn.nsoftware.com/help/BC6/cs/pg_retacicodes.htm) appears to indicate the cardholder signed for the transaction.

## Summary

There is information swirling around us, everywhere we go. Sometimes it takes the form of radio waves and sometimes it is physical piece of paper under your shoe.

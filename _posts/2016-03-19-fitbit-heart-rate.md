---
layout: post
title: Accessing Fitbit Heart Rate Data
tags: [fitbit,oauth]
---

In December 2015, I got a [Fitbit Charge HR](https://www.fitbit.com/chargehr) health tracker. It is a [great device](http://www.consumerreports.org/fitness-trackers/taking-the-pulse-of-fitbits-contested-heart-rate-monitors/) despite [people saying otherwise](http://www.theverge.com/2016/1/6/10724270/fitbit-lawsuit-charge-hr-surge-incomplete-heart-rate-tracking). I have enjoyed the reporting built into the Fitbit mobile and web apps. However, directly accessing your personal health data feels like a fundamental part of fitness trackers and wearable technology.

## Problem
I want to take possession of the intraday heart rate time series data from my fitness tracker.

## Prerequisites
- Get a Fitbit device that records your heart rate (Charge HR, Surge).
- Create a `Personal` app in the [Fitbit dev dashboard](https://dev.fitbit.com/apps) (`Personal`, not `Server` or `Client`, is important for getting access to the most detailed heart rate data).

# OAuth 2.0

Fitbit's [OAuth2 documentation](https://dev.fitbit.com/docs/oauth2/) is excellent and complete. Still it took longer than I would have hoped to get access to my data. This is probably more a symptom of the complexity of the OAuth2.0 specification than shortcomings in Fitbit's implementation or documentation. My goal here is to summarize the minimal steps needed to gain access, being as clear and concise as possible.

Important Bits:

- `OAuth 2.0 Client ID`: six digit app ID (`ABC123`)
- `Client (Consumer) Secret`: 32 character hash token (`12345678123456781234567812345678`)
- `Callback URL`: needs to match one of the callback urls in app setup (`https://tomhummel.com/cb`)

## Initial Authorization

The first step is authorizing the personal "App" to have access to your Fitbit user account. In a browser, load this url with your relevant bits replaced:

```
https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=ABC123&redirect_uri=http://localhost/cb&scope=heartrate
```

Where `client_id` is your `OAuth 2.0 Client ID` and `redirect_uri` is one of the app `Callback URL` values. These values come from the [Fitbit dev dashboard](https://dev.fitbit.com/apps). Your `redirect_uri` **must** match one of the values you entered when creating the personal Fitbit app or the request will fail.

In your browser, you'll be taken through the Fitbit user login and authorization flows. Finally, it will redirect to your `redirect_uri`. It doesn't matter if this url exists or not, the important bit is to get the querystring parameter `code` out of the redirected url in your browser's location bar. This is what we'll use to continue. For me it was a 40-character token. I'll pretend the code is: `98765gfdsa98765gfdsa98765gfdsa98765gfdsa`

To complete the authorization we need to make one final request using the token we just captured. And it is worth noting that this code is only valid for 10 minutes. We're simulating the behavior that would normally happen immediately on your server, triggered by the call made by Fitbit to your `redirect_uri`.

Create your basic auth token by combining your `OAuth 2.0 Client ID` and `Client (Consumer) Secret` separated by a `:`, then base64 encode it. I was able to do this on my macbook with this command:

```
echo -n 'ABC123:12345678123456781234567812345678' | openssl base64
> QUJDMTIzOjEyMzQ1Njc4MTIzNDU2NzgxMjM0NTY3ODEyMzQ1Njc4
```

then fill out this `curl` command with your specific bits:

```
curl \
  -X POST \
  --header "Content-Type: application/x-www-form-urlencoded" \
  --header "Authorization: Basic QUJDMTIzOjEyMzQ1Njc4MTIzNDU2NzgxMjM0NTY3ODEyMzQ1Njc4" \
  https://api.fitbit.com/oauth2/token?client_id=ABC123&grant_type=authorization_code&redirect_uri=https://tomhummel.com/cb&code=98765gfdsa98765gfdsa98765gfdsa98765gfdsa
```

The `Authorization: Basic` header came from our base64 encoded app ID and Secret. The `client_id` is that same six-digit id for our app. The `redirect_uri` should again match your app's settings. And the `code` is what we got back from the url redirection following the login and authorization flow from fitbit.com in our browser.

You might see an error like this:

```
{
  "errors": [
    {
      "errorType": "invalid_grant",
      "message": "Authorization code expired: 98765gfdsa98765gfdsa98765gfdsa98765gfdsa Visit https://dev.fitbit.com/docs/oauth2 for more information on the Fitbit Web API authorization process."
    }
  ],
  "success": false
}
```

The token we took from the browser redirect probably expired. It is only valid for 10 minutes. Redo the Fitbit authorization in the browser and hustle between the browser step and the `curl` step.

Success looks like this:

```
{
  "access_token": "1234512345.67890678906789067890678906789067890678906789067890678906789067890678906789067890678906789067890678906789067890678906789067890678906789067890678906789067890.cvbBNM456745cvbBNM456745-ASD1234555asd-ASDF",
  "expires_in": 3600,
  "refresh_token": "7654ASdf7654ASdf7654ASdf7654ASdf7654ASdf7654ASdf7654ASdf7654ASdf",
  "scope": "heartrate",
  "token_type": "Bearer",
  "user_id": "Z123CV"
}
```

## Making API Requests

The interesting pieces here are `access_token` and `refresh_token`. `access_token` can be used immediately to make requests to the [Fitbit API](https://dev.fitbit.com/docs/heart-rate/).

We can see this work by making an API request:

```
curl -X GET \
  -H "Authorization: Bearer 1234512345.67890678906789067890678906789067890678906789067890678906789067890678906789067890678906789067890678906789067890678906789067890678906789067890678906789067890.cvbBNM456745cvbBNM456745-ASD1234555asd-ASDF" \
  "https://api.fitbit.com/1/user/-/activities/heart/date/2016-01-01/1d.json"
```

We see our heart rate data for a single day!

```
{
  "activities-heart": [
    {
      "dateTime": "2016-01-01",
      "value": {
        "customHeartRateZones": [],
        "heartRateZones": [
          {
            "caloriesOut": 2816.99971,
            "max": 94,
            "min": 30,
            "minutes": 1304,
            "name": "Out of Range"
          },
          {"name": "Fat Burn", ...},
          {"name": "Cardio", ...},
          {"name": "Peak", ...},
        ],
        "restingHeartRate": 59
      }
    }
  ],
  "activities-heart-intraday": {
    "dataset": [
      ...
      {
        "time": "23:58:00",
        "value": 62
      },
      {
        "time": "23:59:00",
        "value": 56
      }
    ],
    "datasetInterval": 1,
    "datasetType": "minute"
  }
}
```

The array of objects under `activities-heart-intraday` is what we're after. This data is a heart rate measurement for every minute in the day (while wearing the device).

## Refresh Token

We would be done now if the `access_token` worked forever. As a security feature of OAuth 2.0, this token is only valid for a short period and it needs to be reissued to continue making requests. If you make a request with an expired access token you will get a `401 Unauthorized` response code. This is where the `refresh_token` comes in.

In the example response above, we received a `refresh_token` value of `7654ASdf7654ASdf7654ASdf7654ASdf7654ASdf7654ASdf7654ASdf7654ASdf`. We can use this token to request a new `access_token` that will again be valid for one hour:

```
curl \
  -X POST \
  --header "Content-Type: application/x-www-form-urlencoded" \
  --header "Authorization: Basic QUJDMTIzOjEyMzQ1Njc4MTIzNDU2NzgxMjM0NTY3ODEyMzQ1Njc4" \
  https://api.fitbit.com/oauth2/token?client_id=ABC123&grant_type=refresh_token&refresh_token=7654ASdf7654ASdf7654ASdf7654ASdf7654ASdf7654ASdf7654ASdf7654ASdf
```

This should look very similar to the request we did earlier but instead of `grant_type=authorization_code` we're doing `grant_type=refresh_token` and passing the refresh_token as a separate argument. The response should also look very familiar. It will contain new values for `access_token` and `refresh_token`.

Note: individual refresh tokens are single use. Attempting to use a refresh token twice will result in a `400 Bad Request` response.

## Conclusion

What we've covered:

- Registering a OAuth2.0 App
- Authorizing App access to detailed heart rate data
- Manually create initial access and refresh token
- Querying heart rate data with an access token
- Refreshing an expired access token

As long as we store an unused refresh token between script runs we can be confident in our ability to do this workflow over and over again:

1. Load unused refresh token
2. Use refresh token to get new refresh and access tokens
3. Store new/unused refresh token (for next run)
4. Use access token to make API requests

We now have all of the fundamental pieces to automate the fetching of personal Fitbit heart rate data on an ongoing basis. I'll cover this in a subsequent post.

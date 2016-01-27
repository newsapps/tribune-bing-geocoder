tribune-bing-geocoder
=====================

A JavaScript wrapper for the [Bing Locations API](https://msdn.microsoft.com/en-us/library/ff701715.aspx).

There are other packages that do this same thing such as [simple-bing-geocoder](https://www.npmjs.com/package/simple-bing-geocoder) or [bing-geocoder](https://www.npmjs.com/package/bing-geocoder).  They are fine.  I wrote this because they lacked an important feature for us: the ability to override the URL of the API endpoint.  Bing's API has the frustrating requirement of sending the API key as a query string parameter.  At the Chicago Tribune, we make a lot of single-page, static apps.  If we want to add geocoding to these apps, we'd have to leak our API key to the client.  We get around this by proxying requests through our own endpoint, implemented with an Amazon Web Services Lambda function. 

Features
--------

* Specify alternate endpoint URL
* Written in ES6

Installation
------------

The best way to install this is using npm:

    npm install tribune-bing-geocoder

If you want to use this in your browser, without using Browserify, you can copy the `tribune-bing-geocoder.js` file to your webserver.  The geocoder class is available as a global named `BingGeocoder`. 

Usage
-----

Basic usage:

    var BingGeocoder = require('tribune-bing-geocoder').BingGeocoder;
    
    var geocoder = new BingGeocoder(process.env.BING_API_KEY);
    geocoder.geocode("435 N. Michigan Ave, Chicago", function(err, data) {
     console.log(data.resourceSets[0].resources[0].point.coordinates);
    });

If you have a proxy to the Bing API (and one that doesn't require an API key), you can override the URL:

    var BingGeocoder = require('tribune-bing-geocoder');
    
    var geocoder = new BingGeocoder(undefined, 'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/production/locations');


You can specify additional query parameters to the API as a third argument to the `geocode()` method:

    var BingGeocoder = require('tribune-bing-geocoder').BingGeocoder;
    
    var geocoder = new BingGeocoder(process.env.BING_API_KEY);
    geocoder.geocode("435 N. Michigan Ave, Chicago", function(err, data) {
     console.log(data.resourceSets[0].resources[0].point.coordinates);
     }, {
       // Specifying location of Chicago to allow users to not have to type city name
       userLocation: "41.8337329,-87.7321555"
     });

Building
--------

If you'd like to build this project for development purposes, run:

    npm run build

This will translate the source code from ES6 syntax and make a UMD version.

Author
------

Geoff Hing <geoffhing@gmail.com> for the Chicago Tribune DataViz team.

License
-------

MIT

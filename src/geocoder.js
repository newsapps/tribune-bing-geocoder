import https from 'https';
import querystring from 'querystring';
import url from 'url';

import jsonp from 'jsonp';

const BING_GEOCODER_API_URL = 'https://dev.virtualearth.net/REST/v1/Locations';

export class BingGeocoder {
  constructor(bingApiKey=undefined, endpointUrl=BING_GEOCODER_API_URL, options) {
    this.options = Object.assign({
      disableJsonp: false
    }, options);
    this.endpointUrl = endpointUrl;
    this.bingApiKey = bingApiKey;
  }

  geocode(address, callback, params={}) {
    let queryParams = {
      q: address
    };
    if (this.bingApiKey) {
      queryParams.key = this.bingApiKey;
    }

    Object.assign(queryParams, params);

    let endpointUrl = this.endpointUrl + '?' + querystring.stringify(queryParams);

    if (process.browser && !this.options.disableJsonp) {
      this._requestJsonp(endpointUrl, callback);
    }
    else {
      this._request(endpointUrl, callback); 
    }
  }

  _request(endpointUrl, callback) {
    let requestOpts = url.parse(endpointUrl);
    // Disable credentials when in browser
    // See http://stackoverflow.com/a/24443043/386210
    //
    // This is needed to get around annoying CORS behavior in our
    // AWS API Gateway/AWS Lambda Function proxy for the Bing API.
    // Browsers don't allow Access-Allow-Origin: '*' when credentials
    // are sent.  So, don't send credentials.
    //
    requestOpts.withCredentials = false;

    https.get(requestOpts, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        let resultData = JSON.parse(data); 
        return callback(null, resultData);
      });
    }).on('error', (e) => {
      callback(e);
    });
  }

  _requestJsonp(endpointUrl, callback) {
    jsonp(endpointUrl, {
      // Bing's API expects the jsonp callback name to be specified in
      // a jsonp query string parameter
      param: 'jsonp'
    }, callback); 
  }
}

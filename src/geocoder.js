import https from 'https';
import querystring from 'querystring';

const BING_GEOCODER_API_URL = 'https://dev.virtualearth.net/REST/v1/Locations';

export class BingGeocoder {
  constructor(bingApiKey=undefined, url=BING_GEOCODER_API_URL) {
    this.url = url;
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

    let url = this.url + '?' + querystring.stringify(queryParams);

    https.get(url, (res) => {
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
}

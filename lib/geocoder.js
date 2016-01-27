'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BingGeocoder = undefined;

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _jsonp = require('jsonp');

var _jsonp2 = _interopRequireDefault(_jsonp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BING_GEOCODER_API_URL = 'https://dev.virtualearth.net/REST/v1/Locations';

var BingGeocoder = exports.BingGeocoder = function () {
  function BingGeocoder() {
    var bingApiKey = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
    var endpointUrl = arguments.length <= 1 || arguments[1] === undefined ? BING_GEOCODER_API_URL : arguments[1];
    var options = arguments[2];

    _classCallCheck(this, BingGeocoder);

    this.options = _extends({
      disableJsonp: false
    }, options);
    this.endpointUrl = endpointUrl;
    this.bingApiKey = bingApiKey;
  }

  _createClass(BingGeocoder, [{
    key: 'geocode',
    value: function geocode(address, callback) {
      var params = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var queryParams = {
        q: address
      };
      if (this.bingApiKey) {
        queryParams.key = this.bingApiKey;
      }

      _extends(queryParams, params);

      var endpointUrl = this.endpointUrl + '?' + _querystring2.default.stringify(queryParams);

      if (process.browser && !this.options.disableJsonp) {
        this._requestJsonp(endpointUrl, callback);
      } else {
        this._request(endpointUrl, callback);
      }
    }
  }, {
    key: '_request',
    value: function _request(endpointUrl, callback) {
      var requestOpts = _url2.default.parse(endpointUrl);
      // Disable credentials when in browser
      // See http://stackoverflow.com/a/24443043/386210
      //
      // This is needed to get around annoying CORS behavior in our
      // AWS API Gateway/AWS Lambda Function proxy for the Bing API.
      // Browsers don't allow Access-Allow-Origin: '*' when credentials
      // are sent.  So, don't send credentials.
      //
      requestOpts.withCredentials = false;

      _https2.default.get(requestOpts, function (res) {
        var data = '';

        res.on('data', function (chunk) {
          data += chunk;
        });

        res.on("end", function () {
          var resultData = JSON.parse(data);
          return callback(null, resultData);
        });
      }).on('error', function (e) {
        callback(e);
      });
    }
  }, {
    key: '_requestJsonp',
    value: function _requestJsonp(endpointUrl, callback) {
      (0, _jsonp2.default)(endpointUrl, {
        // Bing's API expects the jsonp callback name to be specified in
        // a jsonp query string parameter
        param: 'jsonp'
      }, callback);
    }
  }]);

  return BingGeocoder;
}();
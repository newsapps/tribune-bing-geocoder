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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BING_GEOCODER_API_URL = 'https://dev.virtualearth.net/REST/v1/Locations';

var BingGeocoder = exports.BingGeocoder = function () {
  function BingGeocoder() {
    var bingApiKey = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
    var url = arguments.length <= 1 || arguments[1] === undefined ? BING_GEOCODER_API_URL : arguments[1];

    _classCallCheck(this, BingGeocoder);

    this.url = url;
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

      var url = this.url + '?' + _querystring2.default.stringify(queryParams);

      _https2.default.get(url, function (res) {
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
  }]);

  return BingGeocoder;
}();
// const unsplash = new Unsplash({
//   applicationId: "{APP_ACCESS_KEY}",
//   secret: "{APP_SECRET}",
//   callbackUrl: "{CALLBACK_URL}"
// });
import { stringify } from 'querystring';
import Taro from '@tarojs/taro'
import { API_URL } from '../common/constants'
import Photos from './photos'
import Collections from './collections'

class Unsplash {
  constructor({
      applicationId,
      secret,
      callbackUrl,
      bearerToken
    }) {
    this._applicationId = applicationId
    this.secret = secret
    this.callbackUrl = callbackUrl
    this._bearerToken = bearerToken
    this._apiUrl = API_URL
    this._apiVersion = 'v1'

  }

  request({
      url,
      method = 'GET',
      query,
      headers = {},
      oauth = false
    }) {
      let _url = (oauth === true) ?
        url :
        `${this._apiUrl}${url}`;
       let header = Object.assign({}, headers, {
         "Accept-Version": this._apiVersion,
         "Authorization": this._bearerToken ?
           `Bearer ${this._bearerToken}` :
           `Client-ID ${this._applicationId}`
       });

       if(query) {
         _url = `${_url}?${stringify(query)}`
       }

       return Taro.request({
         url: _url,
         method,
         header,
         dataType: 'json'
       }).catch(error => {
          console.error(error)
          return {
            statusCode: error.statusCode || 'network',
            data: null
          }
       })
  }
}

const mixin = (base, ...mixins) => {
  const mixinProps = (target, source) => {
    Object.getOwnPropertyNames(source).forEach(prop => {
      if (/^constructor$/.test(prop)) {
        return;
      }
      Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
    })
  };

  let Ctor;
  if (base && typeof base === 'function') {
    Ctor = class extends base {
      constructor(...props) {
        super(...props);
      }
    };
    mixins.forEach(source => {
      mixinProps(Ctor.prototype, source.prototype);
    });
  } else {
    Ctor = class {};
  }
  return Ctor;
};

export default mixin(Unsplash, Photos, Collections)
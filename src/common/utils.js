import { func } from "prop-types";

function pick(obj, ...list) {
    return Object.keys(obj)
        .filter(key => list.includes(key))
        .reduce(function(pre, next) {
            pre[next] = obj[next];
            return pre;
        }, {});
}

/**
 * 安全的在对象上取值
 * @param {*} obj 需要取值的父对象
 * @param {*} path 取值路径
 * @param {*} defaultValue 如果没取到的默认值
 */
function access(obj, path = '', defaultValue = null) {
    if (!obj) return null;
    const keys = path.split('.');
    let current = obj;
    let ret = defaultValue;
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        const v = current[key];
        if (v == undefined) {
            break;
        }
        if (index === keys.length - 1) {
            ret = v;
            break;
        }
        current = v;
    }
    return ret;
}

function formatDate(date, format) {
  let dateObj = new Date(date);
  let o = {
    'M+': +dateObj.getMonth() + 1, // month
    'D+': dateObj.getDate(), // day
    'h+': dateObj.getHours(), // hour
    'm+': dateObj.getMinutes(), // minute
    's+': dateObj.getSeconds(), // second
    'q+': Math.floor((dateObj.getMonth() + 3) / 3), // quarter
    S: dateObj.getMilliseconds() // millisecond
  };

  if (/(Y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  }

  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return format;
}


function abbreviateNumber(value) {
  var newValue = value;
  if (value >= 1000) {
    var suffixes = ["", "k", "m", "b", "t"];
    var suffixNum = Math.floor(("" + value).length / 3);
    var shortValue = '';
    for (var precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
      var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
      if (dotLessShortValue.length <= 2) {
        break;
      }
    }
    newValue = shortValue + suffixes[suffixNum];
  }
  return newValue;
}


function debounce(fn, time = 350) {
  let timer = null;
  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = null;
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, time)
  }
}

function throttle() {

}

export {
  pick,
  access,
  formatDate,
  abbreviateNumber,
  debounce,
  throttle
};

import qs from 'qs';
import VueCookie from 'vue-cookies';

export function login (params, fn) {
  let {callback, extendParams} = params !== null && typeof params === 'object'
    ? params
    : {};

  if (typeof params === 'function') {
    callback = params;
  }

  if (typeof fn === 'function') {
    callback = params;
  }
  console.log (extendParams);
  return new Promise ((resolve, reject) => {
    console.log (resolve, reject);
  }).then (res => {
    if (res.sessionId) {
      VueCookie.set ('sessionId', res.sessionId, {
        expires: '1M',
        domain: location.hostname,
      });
      VueCookie.set ('sessionId', res.sessionId, {
        expires: '1M',
        domain: 'parramountain.com',
      });
    }
    callback && callback (res);
    return res;
  });
}

export function logout () {
  var keys = document.cookie.match (/[^ =;]+(?==)/g);
  if (keys) {
    for (var i = keys.length; i--; )
      document.cookie = keys[i] + '=0;expires=' + new Date (0).toUTCString ();
  }
  sessionStorage.clear ();
  localStorage.clear ();
}

export function createScript (url, parameter = {}) {
  var cache = createScript.cache || {};

  const script = document.createElement ('script');
  const callback = typeof parameter === 'function'
    ? parameter
    : parameter['callback'];
  const params = typeof parameter !== 'function' && parameter['params'];

  if (cache[url]) {
    document.body.removeChild (cache[url]);
  }

  if (callback) {
    script.onload = callback;
  }

  if (params) {
    url += '?' + qs.stringify (params);
  }

  script.src = url;
  script.async = true;
  document.body.appendChild (script);

  cache[url] = script;

  createScript.cache = cache;
}

export function isEqual (a, b) {
  //如果a和b本来就全等
  if (a === b) {
    //判断是否为0和-0
    return a !== 0 || 1 / a === 1 / b;
  } //判断是否为null和undefined
  if (a == null || b == null) {
    return a === b;
  } //接下来判断a和b的数据类型
  var classNameA = toString.call (a), classNameB = toString.call (b); //如果数据类型不相等，则返回false
  if (classNameA !== classNameB) {
    return false;
  } //如果数据类型相等，再根据不同数据类型分别判断
  switch (classNameA) {
    case '[object RegExp]':
    case '[object String]': //进行字符串转换比较
      return '' + a === '' + b;
    case '[object Number]': //进行数字转换比较,判断是否为NaN
      if (+a !== +a) {
        return +b !== +b;
      } //判断是否为0或-0
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case '[object Date]':
    case '[object Boolean]':
      return +a === +b;
  } //如果是对象类型
  if (classNameA == '[object Object]') {
    //获取a和b的属性长度
    var propsA = Object.getOwnPropertyNames (a),
      propsB = Object.getOwnPropertyNames (b);
    if (propsA.length != propsB.length) {
      return false;
    }
    for (var i = 0; i < propsA.length; i++) {
      var propName = propsA[i]; //如果对应属性对应值不相等，则返回false
      if (a[propName] !== b[propName]) {
        return false;
      }
    }
    return true;
  } //如果是数组类型
  if (classNameA == '[object Array]') {
    if (a.toString () == b.toString ()) {
      return true;
    }
    return false;
  }
}

export function getParams (url = '') {
  let [path, ca] = url.split ('?');
  let pam = {};
  if (ca) {
    const m = ca.split ('&');
    m.map (item => {
      var t = item.split ('=');
      pam[t[0]] = t[1];
    });
  }
  return {path, pam};
}

const o = [
  {
    name: 'index',
    title: '',
  },
  {
    name: 'message-list',
    title: '',
  },
  {
    name: 'account',
    title: '',
  },
  {
    name: 'dashboard',
    title: '',
  },
  {
    name: 'organize-boundaries',
    title: '组织边界',
  },
  {
    name: 'business-navigate',
    title: '网点分布',
  },
  {
    name: 'business-expansion',
    title: '售点拓展',
  },
  {
    name: 'route-planning',
    title: '路线规划',
  },
  {
    name: 'business-district',
    title: '商圈布局',
  },
  {
    name: 'oauth',
    title: '系统管理',
  },
];
export function setChannelName (url) {
  var a = url.split ('/')[1];
  return o.filter (item => item.name == a)[0].title;
}

export const mixin = {
  beforeMount () {
    // alert ('beforeMount');
  },
};
export function computedPage (total, pageSize) {
  if (total) {
    let totals = Number (total);
    let pageSizes = Number (pageSize);
    if (total % pageSizes == 0) {
      return parseInt (totals / pageSizes);
    } else {
      return parseInt (totals / pageSizes) + 1;
    }
  } else {
    return 0;
  }
}

export function downLoadBlobFile (data, fileName = '', type = '') {
  //type为Mime类型
  let name = fileName || new Date ().toLocaleDateString ();
  let typeStr = type ? type : 'application/vnd.ms-excel';

  if (window.navigator.msSaveOrOpenBlob) {
    //兼容性处理
    const blob = new Blob ([data], {type: typeStr});
    navigator.msSaveBlob (blob, name);
  } else {
    const excelBlob = new Blob ([data], {type: typeStr});
    let oa = document.createElement ('a');

    oa.href = URL.createObjectURL (excelBlob);
    oa.download = name;
    document.body.appendChild (oa);
    oa.click ();
    URL.revokeObjectURL (oa.href);
    document.body.removeChild (oa);
  }
}
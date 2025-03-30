import axios from 'axios'

var dataTypes = ['json', 'html']

var buildParams = data => {
  let dataStr = data
  if (data && typeof data !== 'string') {
    var dataStrArr = []
        for (var prop in data) {  // eslint-disable-line
      dataStrArr.unshift(
        `${encodeURIComponent(prop)}=${encodeURIComponent(
          typeof data[prop] === 'object'
            ? JSON.stringify(data[prop])
            : data[prop]
        )}`
      )
    }
    dataStr = dataStrArr.join('&')
  }
  return dataStr
}

var beforeRequest = (url, data, dataType) => {
  if (typeof data === 'string' && dataTypes.indexOf(data) !== -1) {
    dataType = data
    data = null
  }
  data = buildParams(data)
  return {
    url,
    data,
    dataType
  }
}
var afterRequest = (dataType, rawFetch) => {
  if (dataType === 'json') {
    rawFetch = rawFetch.then(response => response.data)
  } else if (dataType === 'html') {
    rawFetch = rawFetch.then(response => response.data)
  }
  return rawFetch
}

var post = (
  url: string,
  data: any,
  dataType: string,
  _customHeader?: any
) => {
  ;({ url, data, dataType } = beforeRequest(url, data, dataType))
  var rawFetch = axios(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded charset=UTF-8',
      ...(_customHeader || {})
    },
    // credentials: 'include',
    withCredentials: true,
    data
  })
  return afterRequest(dataType, rawFetch)
}

var get = (url: string, data, dataType: string, _customHeader: any) => {
  ;({ url, data, dataType } = beforeRequest(url, data, dataType))
  if (data) {
    url += (/\?/.test(url) ? '&' : '?') + data
  }
  var rawFetch = axios(url, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded charset=UTF-8',
      ...(_customHeader || {})
    },
    // credentials: 'include'
    withCredentials: true
  })

  return afterRequest(dataType, rawFetch)
}

export { get, post }

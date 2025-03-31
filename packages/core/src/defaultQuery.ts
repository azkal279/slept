import { post, get } from './fetch'
import { IListQueryOptions, IListFetchResponse } from './types'

export default function(queryPayload: IListQueryOptions) {
  let { data, url, method } = queryPayload
  let fetch = method === 'POST' ? post : get
  return fetch(url, data, 'json').then((resp: IListFetchResponse) => {
    let { code, data, message } = resp
    if ([0, 200, '0', '200'].indexOf(code) === -1) {
      throw new Error(message || 'System Error')
    } else {
      return data
    }
  })
}

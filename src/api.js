import Vue from 'vue'
import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:8081/',
  json: true
})

export default {
  async execute (method, resource, data) {
    // inject the accessToken for each request
    let accessToken = await Vue.prototype.$auth.getAccessToken()
    return client({
      method,
      url: resource,
      data,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(req => {
      return req.data
    })
  },
  getDisposedItems() {
     return this.execute('get', '/disposed-items')
  },
  getDisposedItem(id) {
     return this.execute('get', `/disposed-items/${id}`)
  },
  createDisposedItem(data) {
     return this.execute('post', '/disposed-items', data)
  },
  updateDisposedItem(id, data) {
     return this.execute('put', `/disposed-items/${id}`, data)
  },
  deleteDisposeditem(id) {
     return this.execute('delete', `/disposed-items/${id}`)
  },
  getDisposedItemCategories() {
     return this.execute('get', '/disposed-item-category')
  },
  getDisposedItemCategory(id) {
     return this.execute('get', `/disposed-item-category/${id}`)
  },
  createDisposedItemCategory(data) {
     return this.execute('post', '/disposed-item-category', data)
  },
  updateDisposedItemCategory(id, data) {
     return this.execute('put', `/disposed-item-category/${id}`, data)
  },
  deleteDisposeditemCategory(id) {
     return this.execute('delete', `/disposed-item-category/${id}`)
  }

}

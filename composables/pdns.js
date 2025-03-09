import axios from 'axios'

async function get(PartUrl) {
  return axios.get('http://' + localStorage.getItem('ServerAddress') + ':' + localStorage.getItem('ServerPort') + PartUrl, {
    headers: {
      'X-API-KEY': 'changeme'
    }
  })
}

async function patch(PartUrl, payload) {
  return axios.patch('http://' + localStorage.getItem('ServerAddress') + ':' + localStorage.getItem('ServerPort') + PartUrl, 
    payload, 
    {
      headers: {
        'X-API-KEY': 'changeme'
      }
    }
  )
}

export function usePdns() {
  return {
    get: get,
    patch: patch,
  }
}
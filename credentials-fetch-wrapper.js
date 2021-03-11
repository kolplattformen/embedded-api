module.exports = function credentialsDecorator (fetch) {
  fetch = fetch || window.fetch

  async function fetchWrapper (url, opts) {
    opts = opts || {}

    // Prepare request
    if(opts.credentials == 'omit'){
        if(opts.headers && opts.headers.cookie){
            delete opts.headers.cookie
        }
    }

    // Actual request
    const res = await fetch(url, opts)

    return res
  }

  return fetchWrapper
}
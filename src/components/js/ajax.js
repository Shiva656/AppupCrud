/**
 * Function to make rest calls using fetch api
 * @param {string} url    # url to make a call
 * @param {json} data   # object with method type and payload
 * @param {function} success # success callback for the url
 * @param {function} fail   # fail callback for the url
 */
export function data (url, data, success, fail) {
  fetch(url, data)
    .then(res => {
      if (!res.ok) { throw new Error('HTTP status ' + res.status); }
      return res.json()
    })
    .then(response => {
      success(response);
    })
    .catch((err) => {
      fail(err);
    });
}

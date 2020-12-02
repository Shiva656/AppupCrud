/* eslint-disable no-unused-vars */
/**
 * GET displayable columns
 */
import crud from '../js/crud'
export async function getDisplayableColumns (entity, columns, t) {
  try {
    if (t === '_f') { console.log('sss', columns.filter(i => { return i[t] })); }
    return columns.filter(i => { return i[t] });

    // eslint-disable-next-line no-empty
  } catch (e) {}
  return false;
}

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
/**
 * Get current app from route
 */
export function getApp () {
  // Return queryStringToJSON(location.href).app;
  return 'push';
}

/**
 * Get data based on filter
 */
export function getData (entity, filter) {
  return new Promise((resolve, reject) => {
    const app = getApp();
    return resolve(crud.url.getUrl);
  });
}

/**
   * POST data based on filter
   */
export function saveDataUrl (entity, id) {
  return new Promise((resolve, reject) => {
    const app = getApp();
    return resolve(crud.url.postUrl);
  });
}

/**
   * PUT data based on filter
   */
export function updateDataUrl (entity, id) {
  return new Promise((resolve, reject) => {
    const app = getApp();
    return resolve(crud.url.putUrl);
  });
}
/**
 * DELETE data based on filter
 */
export function deleteDataUrl (entity) {
  return new Promise((resolve, reject) => {
    const app = getApp();
    return resolve(crud.url.deleteUrl);
  });
}

/**
 * Loading props from params
 */
export function propsFromParams (str) {
  const y = {}
  try {
    str.split(',').map(item => { const data = item.split('='); if (data) { y[`${data[0]}`] = data[1] } })
  // eslint-disable-next-line no-empty
  } catch (e) {}
  return y
}

window.props_from_params = propsFromParams;
window.get_app = getApp;

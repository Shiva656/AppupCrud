/**
 * @mixin
 */
export const GlobalFunc = {
  methods: {
    get_sentence_case: function (type, str) {
      let returnData = '';
      if ((str === null) || (str === '')) {
        return false
      } else {
        switch (type) {
          case 'upper':
            returnData = str.toUpperCase();
            break;
          case 'lower':
            returnData = str.toLowerCase();
            break;
          default:
            returnData = 'Please check type';
        }
        return returnData;
      }
    },
    get_title_case: function (str) {
      if ((str === null) || (str === '')) { return false; } else { str = str.toString(); }

      return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    },
    convert_date: function (data, format) {
      let returnData = '';
      if ((data === null) || (data === '')) {
        return false
      } else {
        switch (format) {
          case 'local':
            returnData = new Date(data);
            break;
          case 'epoch':
            returnData = new Date(data).getTime() / 1000;
            break;
          default:
            returnData = 'Please check format';
        }
        return returnData;
      }
    }
  }
}

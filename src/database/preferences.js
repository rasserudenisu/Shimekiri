module.exports = {
  flipFuzzy: function () {
    var fuzz = this.isFuzzy()
    fuzz = !fuzz
    localStorage.setItem('fuzzy', fuzz)
    return localStorage.getItem('fuzzy')
  },
  isFuzzy: function () {
    if (!localStorage.getItem('fuzzy')) {
      localStorage.setItem('fuzzy', true)
    }
    return localStorage.getItem('fuzzy')
  },
  getDateFormat: function () {
    if (!localStorage.getItem('dateFormat')) {
      localStorage.setItem('dateFormat', 'ja-JP')
    }
    return localStorage.getItem('dateFormat')
  },
  setDateFormat: function (target) {
    localStorage.setItem('dateFormat', target)
    return localStorage.getItem('dateFormat')
  }
}

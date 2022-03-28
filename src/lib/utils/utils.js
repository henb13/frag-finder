module.exports = {
  camelizeIsh: function (text) {
    text = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
    return text;
  },
};

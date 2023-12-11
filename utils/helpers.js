const Handlebars = require("handlebars");

module.exports = {
  renderSkinsList: function (user, skins) {
    let html = "<ul>";

    skins.forEach((skin) => {
      if (user.id === skin.userId) {
        html += `<li>${skin.name} (${skin.userId})</li>`;
      }
    });

    html += "</ul>";
    return new Handlebars.SafeString(html);
  },
};

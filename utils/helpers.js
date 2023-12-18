module.exports = {
  capitalize: (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },
  formatDate: (date) => {
    return new Date(date).toLocaleDateString();
  },
  isAuthor: (user, post) => {
    const isAuthor = user.id === post.authorId;
    return isAuthor;
  },
};
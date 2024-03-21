const _ = require("lodash");

const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item;

  return blogs.length === 0
    ? 0
    : blogs.map((blog) => blog.likes).reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  let current = {};

  blogs.forEach((blog) => {
    if (!current.likes || blog.likes > current.likes) {
      current = {
        title: blog.title,
        author: blog.author,
        likes: blog.likes,
      };
    }
  });

  return current;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  const blogsByAuthor = _.values(_.groupBy(blogs, "author"));
  const res = _.maxBy(blogsByAuthor, "length");

  return {
    author: res[0].author,
    blogs: res.length,
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  const blogsByAuthor = _.values(_.groupBy(blogs, "author"));
  const likes = blogsByAuthor.map((list) => _.sumBy(list, "likes"));
  const max = Math.max.apply(Math, likes);
  const res = blogsByAuthor[likes.indexOf(max)];

  return {
    author: res[0].author,
    likes: max,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};

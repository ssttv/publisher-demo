/** server/controllers/article.ctrl.js */
const Article = require('./../models/Article');
const User = require('./../models/User');
const fs = require('fs');
const cloudinary = require('cloudinary');

module.exports = {
  addArticle: (req, res, next) => {
    const {
      text, title, claps, description,
    } = req.body;
    if (req.files.image) {
      cloudinary.uploader.upload(
        req.files.image.path,
        (result) => {
          const obj = {
            text,
            title,
            claps,
            description,
            feature_img: result.url != null ? result.url : '',
          };
          saveArticle(obj);
        },
        {
          resource_type: 'image',
          eager: [{ effect: 'sepia' }],
        },
      );
    } else {
      saveArticle({
        text,
        title,
        claps,
        description,
        feature_img: '',
      });
    }
    function saveArticle(obj) {
      new Article(obj).save((err, article) => {
        if (err) res.send(err);
        else if (!article) res.send(400);
        else {
          return article.addAuthor(req.body.author_id).then(_article => res.send(_article));
        }
        next();
      });
    }
  },
  getAll: (req, res, next) => {
    Article.find(req.params.id)
      .populate('author')
      .populate('comments.author')
      .exec((err, article) => {
        if (err) res.send(err);
        else if (!article) res.send(404);
        else res.send(article);
        next();
      });
  },
  /**
   * article_id
   */
  clapArticle: (req, res, next) => {
    Article.findById(req.body.article_id)
      .then(article => article.clap().then(() => res.json({ msg: 'Done' })))
      .catch(next);
  },
  /**
   * comment, author_id, article_id
   */
  commentArticle: (req, res, next) => {
    Article.findById(req.body.article_id)
      .then(article =>
        article
          .comment({
            author: req.body.author_id,
            text: req.body.comment,
          })
          .then(() => res.json({ msg: 'Done' })))
      .catch(next);
  },
  /**
   * article_id
   */
  getArticle: (req, res, next) => {
    Article.findById(req.params.id)
      .populate('author')
      .populate('comments.author')
      .exec((err, article) => {
        if (err) res.send(err);
        else if (!article) res.send(404);
        else res.send(article);
        next();
      });
  },
};

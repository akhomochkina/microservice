const { createErrorResponse } = require('../../../src/response');
const { Fragment } = require('../../model/fragment');
var MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();

let fragment;
let data;

module.exports = async (req, res) => {
  try {
    var id = req.params.id;
    if (req.params.id.includes('.html')) id = req.params.id.split('.').slice(0, -1).join('.');
    fragment = await Fragment.byId(req.user, id);
    data = await fragment.getData();

    if (req.params.id.includes('.html')) {
      if (fragment.type == 'text/markdown') {
        res.setHeader('Content-type', 'text/html');
        res.status(200).send(md.render(data.toString()));
      }
    } else {
      res.setHeader('Content-type', fragment.type);
      res.status(200).send(data);
    }
  } catch (error) {
    res.status(500).json(createErrorResponse(500, error.message));
  }
};

const { createErrorResponse } = require('../../../src/response');
const { Fragment } = require('../../model/fragment');

let fragment;
let data;

module.exports = async (req, res) => {
  try {
    fragment = await Fragment.byId(req.user, req.params.id);
    data = await fragment.getData();
    res.setHeader('Content-type', fragment.type);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json(createErrorResponse(500, error.message));
  }
};

const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

let fragment;

module.exports = async (req, res) => {
  try {
    fragment = await Fragment.byId(req.user, req.params.id);
    res.status(200).json(fragment);
  } catch (error) {
    res.status(500).json(createErrorResponse(500, error.message));
  }
};

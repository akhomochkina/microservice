const { createSuccessResponse, createErrorResponse } = require('../../../src/response');
const { Fragment } = require('../../model/fragment');

let fragment;
const apiURL = process.env.API_URL;

module.exports = async (req, res) => {
  try {
    fragment = new Fragment({
      ownerId: req.user,
      type: req.get('Content-Type'),
      size: req.body.length,
    });
    await fragment.save();
    await fragment.setData(req.body);
    res.location(`${apiURL}/v1/fragments/${fragment.id}`);
    res.status(200).json(createSuccessResponse({ fragments: fragment }));
  } catch (error) {
    res.status(500).json(createErrorResponse(500, error.message));
  }
};

const { createSuccessResponse, createErrorResponse } = require('../../../src/response');
const { Fragment } = require('../../model/fragment');

let fragment;
const apiURL = process.env.API_URL;

module.exports = async (req, res) => {
  if (!Buffer.isBuffer(req.body))
    return res.status(415).json(createErrorResponse(415, 'Type is not supported'));

  try {
    fragment = new Fragment({
      ownerId: req.user,
      type: req.get('Content-Type'),
      size: req.body.length,
    });
    await fragment.save();
    await fragment.setData(req.body);
    res.location(`${apiURL}/v1/fragments/${fragment.id}`);
    res.status(201).json(createSuccessResponse({ fragment: fragment }));
  } catch (error) {
    res.status(500).json(createErrorResponse(500, error.message));
  }
};

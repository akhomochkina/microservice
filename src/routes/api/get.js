// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */

const { createSuccessResponse } = require('../../../src/response');
const { Fragment } = require('../../model/fragment');

let fragment;
module.exports = async (req, res) => {
  fragment = await Fragment.byUser(req.user, req.query.expand);

  res.status(200).json(createSuccessResponse({ fragments: fragment }));
};

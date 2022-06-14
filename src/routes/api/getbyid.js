const { createSuccessResponse, createErrorResponse } = require('../../../src/response');
const { Fragment } = require('../../model/fragment');

let fragment;
//const apiURL = process.env.API_URL;

module.exports = async (req, res) => {
  try {
    fragment = await Fragment.byId(req.user, req.params.id);
    //res.location(`${apiURL}/v1/fragments/${fragment.id}`);
    console.log(fragment);
    res.status(200).json(createSuccessResponse({ fragments: fragment }));
  } catch (error) {
    res.status(500).json(createErrorResponse(500, error.message));
  }
};

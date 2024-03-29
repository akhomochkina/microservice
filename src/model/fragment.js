// Use https://www.npmjs.com/package/nanoid to create unique IDs
//const { nanoid } = require('nanoid');
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

const validTypes = [
  'text/plain',
  'text/plain; charset=utf-8',
  `text/markdown`,
  `text/html`,
  `application/json`,
  `image/png`,
  `image/jpeg`,
  `image/webp`,
  `image/gif`,
];

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (id) this.id = id;
    else this.id = randomUUID();

    if (ownerId) this.ownerId = ownerId;
    else throw new Error('Error with user id');

    if (created) this.created = created;
    else this.created = new Date().toISOString();

    if (updated) this.updated = updated;
    else this.updated = new Date().toISOString();

    if (Fragment.isSupportedType(type)) this.type = type;
    else throw new Error('Error, unsupported type');

    if (size < 0 || typeof size !== 'number') throw new Error('Size error');
    else this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    try {
      return await listFragments(ownerId, expand);
    } catch (error) {
      throw new Error('Cannot get fragments');
    }
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    try {
      return new Fragment(await readFragment(ownerId, id));
    } catch (error) {
      throw new Error('Unable to to get the fragment');
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    try {
      return deleteFragment(ownerId, id);
    } catch (error) {
      throw new Error('Unable to delete users fragment data');
    }
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    try {
      this.updated = new Date().toISOString();
      return writeFragment(this);
    } catch (error) {
      throw new Error('Unable to save current fragment');
    }
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    try {
      return readFragmentData(this.ownerId, this.id);
    } catch (err) {
      throw new Error(`Unable to get data`);
    }
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    try {
      if (data) {
        this.updated = new Date().toISOString();
        this.size = Buffer.byteLength(data);
        this.save();
        return await writeFragmentData(this.ownerId, this.id, data);
      } else throw new Error('Cannot set data, try again');
    } catch (error) {
      throw new Error('Unable to set fragments data');
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    if (this.mimeType.startsWith('text/')) return true;
    else return false;
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    if (this.type.includes('text/plain')) return ['text/plain'];
    else return new Error('Format cannot be converted');
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    if (validTypes.includes(value)) return true;
    else return false;
  }
}
module.exports.Fragment = Fragment;

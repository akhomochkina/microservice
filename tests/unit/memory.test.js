const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  listFragments,
  deleteFragment,
} = require('../../src/model/data/memory/index');

describe('Fragment database related calls', () => {
  test('writeFragment() to return nothing(undefined)', async () => {
    const result = await writeFragment({ ownerId: '', id: '', fragment: {} });
    expect(result).toBe(undefined);
  });

  test('writeFragment() and readFragment() to write and read data', async () => {
    const data = { ownerId: '10', id: '1', fragment: 'test1' };
    await writeFragment(data);
    const result = await readFragment('10', '1');
    expect(result).toEqual(data);
  });

  test('writeFragmentData() expects to throw because there is no data', async () => {
    const data = {};
    expect(async () => await writeFragmentData(data)).rejects.toThrow();
  });

  test('writeFragmentData() and readFragmentData() to write and read data', async () => {
    await writeFragmentData('20', '2', 'test2');
    const result = await readFragmentData('20', '2');
    expect(result).toEqual('test2');
  });

  test('listFragments() to get the list of ids from same ownerId', async () => {
    await writeFragment({ ownerId: '30', id: '3', fragment: 'test3' });
    await writeFragment({ ownerId: '30', id: '4', fragment: 'test4' });
    const result = await listFragments('30');
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual(['3', '4']);
  });

  test('listFragments() to return empty array', async () => {
    const result = await listFragments('40', true);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([]);
  });

  test('deleteFragment() to delete data from db', async () => {
    await writeFragment({ ownerId: '50', id: '5', fragment: 'test5' });
    await writeFragmentData('50', '5', 'test5Data');
    await deleteFragment('50', '5');
    const deletedResult = await listFragments('50');
    expect(Array.isArray(deletedResult)).toBe(true);
    expect(deletedResult).toEqual([]);
  });
});

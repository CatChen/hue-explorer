import Storage from '../Storage';

const STORAGE_NAME = 'test_storage';
const STORAGE_VERSION = 42;
const TEST_OBJECT = {
  x: 1,
  y: ['hello', 'world'],
  z: false,
};

let localStorageBackup = null;
let getItem = jest.fn();
let setItem = jest.fn();
let removeItem = jest.fn();

beforeEach(() => {
  getItem = jest.fn();
  setItem = jest.fn();
  removeItem = jest.fn();
  const localStorageMock = {
    getItem,
    setItem,
    removeItem,
  };
  localStorageBackup = global.localStorage;
  global.localStorage = localStorageMock
});

afterEach(() => {
  global.localStorage = localStorageBackup;
});

it('accepts name and version in constructor', () => {
  const storage = new Storage(STORAGE_NAME, STORAGE_VERSION);
  expect(storage.name).toBe(STORAGE_NAME);
  expect(storage.version).toBe(STORAGE_VERSION);
});

it('stores version number', () => {
  const storage = new Storage(STORAGE_NAME, STORAGE_VERSION);
  expect(setItem.mock.calls.length).toBe(1);
  expect(setItem.mock.calls[0].length).toBe(2);
  expect(setItem.mock.calls[0][0]).toBe(STORAGE_NAME);
  expect(setItem.mock.calls[0][1]).toBe(STORAGE_VERSION);
});

it('can write object to storage', () => {
  const storage = new Storage(STORAGE_NAME, STORAGE_VERSION);
  storage.write(TEST_OBJECT);
  expect(setItem.mock.calls.length).toBe(2);
  expect(setItem.mock.calls[1].length).toBe(2);
  expect(setItem.mock.calls[1][0]).toBe(`${STORAGE_NAME}:${STORAGE_VERSION}`);
  expect(setItem.mock.calls[1][1]).toBe(JSON.stringify(TEST_OBJECT));
});

it('can read object from storage', () => {
  const storage = new Storage(STORAGE_NAME, STORAGE_VERSION);
  getItem.mockImplementationOnce((key) => {
    expect(key).toBe(`${STORAGE_NAME}:${STORAGE_VERSION}`);
    return JSON.stringify(TEST_OBJECT);
  });
  const json = storage.read();
  expect(json).toEqual(TEST_OBJECT);
});

it('clears storage after version bumping', () => {
  getItem.mockImplementationOnce((key) => {
    expect(key).toBe(STORAGE_NAME);
    return JSON.stringify(STORAGE_VERSION);
  });
  const storage = new Storage(STORAGE_NAME, STORAGE_VERSION + 1);
  expect(removeItem.mock.calls.length).toBe(1);
  expect(removeItem.mock.calls[0].length).toBe(1);
  expect(removeItem.mock.calls[0][0]).toBe(`${STORAGE_NAME}:${STORAGE_VERSION}`);
});
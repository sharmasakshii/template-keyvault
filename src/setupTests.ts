// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });

jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "group").mockImplementation(() => {});
jest.spyOn(console, "groupCollapsed").mockImplementation(() => {});
jest.spyOn(console, "groupEnd").mockImplementation(() => {});
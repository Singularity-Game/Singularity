import { NoCommaPipe } from './no-comma.pipe';

describe('NoCommaPipe', () => {
  it('create an instance', () => {
    const pipe = new NoCommaPipe();
    expect(pipe).toBeTruthy();
  });
});

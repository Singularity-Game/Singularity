import { OrderByPipe } from './order-by.pipe';

describe('NoCommaPipe', () => {
  it('create an instance', () => {
    const pipe = new OrderByPipe();
    expect(pipe).toBeTruthy();
  });
});

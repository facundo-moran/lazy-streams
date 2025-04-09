import { describe, it, expect } from 'vitest';
import { LazyStream } from '../src/index';

describe('LazyStream', () => {
  it('should take first 3 natural numbers', () => {
    const result = LazyStream.from().take(3);
    expect(result).toEqual([0, 1, 2]);
  });

  it('should map values to squares', () => {
    const result = LazyStream.from(1).map(n => n * n).take(3);
    expect(result).toEqual([1, 4, 9]);
  });

  it('should filter even numbers', () => {
    const result = LazyStream.from(0).filter(n => n % 2 === 0).take(3);
    expect(result).toEqual([0, 2, 4]);
  });

  it('should zip values with squares', () => {
    const zipped = LazyStream.from(1).zip(LazyStream.from(1).map(n => n * n), (a, b) => `${a}^2=${b}`);
    expect(zipped.take(3)).toEqual(['1^2=1', '2^2=4', '3^2=9']);
  });

  it('should group by even/odd', () => {
    const values = LazyStream.fromArray([1, 2, 3, 4]).groupBy(n => n % 2 === 0 ? 'even' : 'odd');
    expect(values.get('even')).toEqual([2, 4]);
    expect(values.get('odd')).toEqual([1, 3]);
  });

  it('should chunk in groups of 2', () => {
    const result = LazyStream.fromArray([1, 2, 3, 4, 5]).chunk(2).take(3);
    expect(result).toEqual([[1, 2], [3, 4], [5]]);
  });
});

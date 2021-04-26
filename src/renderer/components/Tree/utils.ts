/**
 * @description 在本组件中，不会出现超额度使用的情况，文件项数量始终大于可见项数量，因此具有以下限制：
 * - `use()` 方法不判断超额
 * - `resize()` 方法根据传入值分配空间
 */
export class Pool<T> {
  private pool!: T[];

  private creator!: () => T;

  constructor(creator: () => T, size = 10) {
    this.pool = [];
    this.creator = creator;

    for (let i = 0; i < size; i++) this.pool.push(this.creator());
  }

  fetch(num: number) {
    return this.pool.slice(0, num);
  }

  resize(num: number) {
    if (num > this.pool.length) {
      const len = num - this.pool.length;
      for (let i = 0; i < len; i++) this.pool.push(this.creator());
    } else {
      this.pool = this.pool.slice(0, num);
    }
  }
}

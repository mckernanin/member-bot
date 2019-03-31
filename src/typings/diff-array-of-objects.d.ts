declare module "diff-arrays-of-objects" {
  enum UpdatedOptions {
    first = 1,
    second = 2,
    both = 3,
    bothWithDeepDiff = 4
  }
  interface DiffReturn {
    same: Array<any>;
    added: Array<any>;
    updated: Array<any>;
    removed: Array<any>;
  }
  function diff(
    first: Array<any>,
    second: Array<any>,
    idField?: String,
    options?: {
      compareFunction: (i1: Array<any>, i2: Array<any>) => {};
      updatedValues: Number;
    }
  ): DiffReturn;

  export = diff;
}

type Values<T> = T[keyof T];

type ChainedAccessUnionHelper<
  T,
  A = {
    [Key in keyof T]: T[Key] extends string ? never : T[Key];
  },
  B = {
    [Key in keyof A]: A[Key] extends never
      ? never
      : A[Key] extends object
      ?
          | `${Extract<Key, string>}.${Extract<keyof A[Key], string>}`
          | (ChainedAccessUnionHelper<A[Key]> extends infer U ? `${Extract<Key, string>}.${Extract<U, string>}` : never)
      : never;
  }
> = T extends object ? Exclude<keyof A | Exclude<Values<B>, never>, never> : never;

declare type ChainedAccessUnion<T extends object> = ChainedAccessUnionHelper<T>;

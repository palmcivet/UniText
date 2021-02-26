type AddPrefix<Prefix, Keys> = `${Prefix & string}.${Keys & string}`;

declare type MapGet<T> = {
  [K in keyof T]: AddPrefix<K, keyof T[K]>;
}[keyof T];

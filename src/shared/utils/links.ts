/**
 * 验证标准 URL
 * @param raw 字符串
 * @returns boolean
 */
export const validateURL = (raw: string) => {
  try {
    new URL(raw);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * 清洗 URL
 * @param raw 字符串
 * @returns boolean
 */
export const cleanURL = (raw: string) => {
  let res;

  try {
    const { origin, protocol, host, pathname } = new URL(raw);
    res = origin === "null" ? `${protocol}${host}${pathname}` : `${origin}${pathname}`;
  } catch (err) {
    res = raw;
  }

  return res;
};

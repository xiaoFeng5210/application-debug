export function FloatFormatter(value: number) {
  // // 先移除非数字、小数点和负号的字符
  // const cleanValue = value.toString().replace(/[^\d.-]/g, '');

  // // 匹配整数或小数的正则
  // const regex = /^-?\d+(\.\d*)?$/;

  // if (!regex.test(cleanValue)) {
  //   return 0;
  // }

  // // 如果包含小数点，则保留2位小数
  // if (cleanValue.includes('.')) {
  //   return Number(cleanValue).toFixed(2);
  // }
  // // 是整数则直接返回
  // return Number(cleanValue);
  return Number(value);
}

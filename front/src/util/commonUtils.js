export function restoreNewlines(input) {
  if (input !== null) {
    // 将 *fzzf* 替换为换行符
    return input.replace(/\*fzzf\*/g, '\n');
  }
  return null;
}

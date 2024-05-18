export const trimText = (text: string, numOfChars: number) => {
  return text.length > numOfChars
    ? text.substring(0, numOfChars) + "..."
    : text;
};

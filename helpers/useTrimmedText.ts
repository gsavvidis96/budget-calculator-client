export const useTrimmedText = (text: Ref<string>, numOfChars: number) => {
  const trimmedText = computed(() =>
    text.value.length > numOfChars
      ? text.value.substring(0, numOfChars) + "..."
      : text.value
  );

  return trimmedText;
};

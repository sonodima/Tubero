const getIdFromUrl = (url: string): string | boolean => {
  const match = url.match(
    /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/
  );

  return match && match[1].length === 11 ? match[1] : false;
};

export default getIdFromUrl;

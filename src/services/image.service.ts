const convertBase64ToBlob = (base64: string, type: string = "image/png") => {
  const binary = atob(base64.split(",")[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type });
};

export default convertBase64ToBlob;

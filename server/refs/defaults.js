

module.exports = () => {
  const photos = [
    'https://cdn.filestackcontent.com/nyCY2ySPRSmaMhnytXP9',
  ];
  return photos[Math.floor(Math.random() * photos.length)];
};

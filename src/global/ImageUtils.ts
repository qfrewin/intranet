const parseImageURL = (image: string): string => {
    if (image) {
      const imageData = JSON.parse(image);
      const imageUrl = `${imageData.serverUrl}${imageData.serverRelativeUrl}`;
      return imageUrl;
    }
    return image;
};
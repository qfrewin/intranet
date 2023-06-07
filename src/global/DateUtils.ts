export const formatDateFromOptions = (dateString: string, options: Intl.DateTimeFormatOptions): string => {
  const date = new Date(dateString);
  
  // Adjust time zone if necessary
  const timeZoneOffset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() + timeZoneOffset);
  
  return date.toLocaleDateString(undefined, options);
};

export const formatDateFromString = (dateString: string, format: string): string => {
  const recognizedCharacters = ['m', 'M', 'd', 'D', 'y'];
  const separatorRegex = /[^mMdDy]+/g;
  const parts = format.split(separatorRegex);

  let formattedDate = '';
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const count = countRecognizedCharacters(part, recognizedCharacters);
    const character = part.charAt(0);

    if (recognizedCharacters.indexOf(character) !== -1) {
      const options: Intl.DateTimeFormatOptions = generateOptions(character, count);
      const formattedPart = formatDateFromOptions(dateString, options);
      formattedDate += formattedPart;
    } else {
      formattedDate += part;
    }

    if (i !== parts.length - 1) {
      formattedDate += format.charAt(format.indexOf(part) + part.length);
    }
  }

  return formattedDate;
};

const countRecognizedCharacters = (str: string, recognizedCharacters: string[]): number => {
  let count = 0;
  let i = 0;

  while (i < str.length && recognizedCharacters.indexOf(str.charAt(i)) !== -1) {
    count++;
    i++;
  }

  return count;
};

const generateOptions = (character: string, count: number): Intl.DateTimeFormatOptions => {
  const options: Intl.DateTimeFormatOptions = {};

  switch (character) {
    case 'm':
      options.month = count === 1 ? 'numeric' : '2-digit';
      break;
    case 'M':
      switch (count) {
        case 1:
          options.month = 'narrow';
          break;
        case 2:
          options.month = 'short';
          break;
        case 3:
          options.month = 'long';
          break;
      }
      break;
    case 'd':
      options.day = count === 1 ? 'numeric' : '2-digit';
      break;
    case 'D':
      switch (count) {
        case 1:
          options.weekday = 'narrow';
          break;
        case 2:
          options.weekday = 'short';
          break;
        case 3:
          options.weekday = 'long';
          break;
      }
      break;
    case 'y':
      options.year = count <= 2 ? '2-digit' : 'numeric';
      break;
  }

  return options;
};

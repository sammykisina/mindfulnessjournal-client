import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


/**
 * TIME INDICATOR
 */
export const getTime = () => {
  const today = new Date();
  const curHr = today.getHours();

  if (curHr < 12) {
    return 'Good Morning';
  } else if (curHr < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

/**
 * GENERATE AVATAR FROM NAME
 */
export const combineAndUpperCaseFirstLetters = (
  str1: string,
  str2: string
): string => {
  if (str1?.length > 0 && str2?.length > 0) {
    const combinedLetters = (str1[0] + str2[0])?.toUpperCase();
    return combinedLetters;
  }

  if (str1?.length > 0 && !str2) {
    const combinedLetters = str1[0]?.toUpperCase();
    return combinedLetters;
  }

  return '';
};

/**
 * JOIN STRINGS WITH A COMMA
 */
export const joinValues = (values: string[]): string => {
  const joinedValues = values?.join(', ');

  const endResult =
    joinedValues.substring(0, joinedValues.lastIndexOf(', ') + 2) +
    joinedValues.substring(joinedValues.lastIndexOf(', ') + 2);

  return endResult;
};



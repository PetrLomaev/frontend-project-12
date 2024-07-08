/* eslint-disable */
import filter from 'leo-profanity';

const censorFunc = (nameForClean) => {
  filter.loadDictionary('ru');
  const cleanRuName = filter.clean(nameForClean);
  filter.loadDictionary('en');
  const cleanEnName = filter.clean(cleanRuName);
  return cleanEnName;
};

export default censorFunc;
import { atom } from 'recoil';

const searchKeyState = atom<string>({
  key: 'searchKeyState',
  default: '',
});

const SearchAtoms = {
  searchKeyState,
};

export default SearchAtoms;

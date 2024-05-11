import { Activity } from '@/types/activity';
import { atom } from 'recoil';

const globalActivityState = atom<Activity>({
  key: 'globalActivityState',
  default: null,
});

const ActivityAtoms = {
  globalActivityState,
};

export default ActivityAtoms;

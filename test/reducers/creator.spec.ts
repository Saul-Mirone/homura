import { AnyAction } from 'redux';
import { Step } from '../../app/components/SideBar/BottomBar';
import {
  creatorReducer,
  reset,
  setLink,
  setName,
  stepToEnterName,
  stepToEnterUrl,
} from '../../app/features/creator/creatorSlice';

describe('reducers', () => {
  describe('creator', () => {
    it('should handle initial state', () => {
      expect(creatorReducer(undefined, {} as AnyAction)).toMatchSnapshot();
    });

    it('should handle stepToEnterUrl', () => {
      expect(
        creatorReducer(
          { step: null, link: '', name: '' },
          { type: stepToEnterUrl }
        )
      ).toMatchSnapshot();
    });

    it('should handle stepToEnterName', () => {
      expect(
        creatorReducer(
          { step: null, link: '', name: '' },
          { type: stepToEnterName }
        )
      ).toMatchSnapshot();
    });

    it('should handle reset', () => {
      expect(
        creatorReducer(
          { step: Step.EnterUrl, link: 'link', name: 'name' },
          { type: reset }
        )
      ).toMatchSnapshot();
    });

    it('should handle setLink', () => {
      expect(
        creatorReducer(
          { step: null, link: '', name: '' },
          { type: setLink, payload: 'link' }
        )
      ).toMatchSnapshot();
    });

    it('should handle setName', () => {
      expect(
        creatorReducer(
          { step: null, link: '', name: '' },
          { type: setName, payload: 'name' }
        )
      ).toMatchSnapshot();
    });

    it('should handle unknown action type', () => {
      expect(
        creatorReducer({ step: null, link: '', name: '' }, { type: 'unknown' })
      ).toMatchSnapshot();
    });
  });
});

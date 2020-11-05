import { AnyAction } from 'redux';
import { Step } from '../../app/components/SideBar/BottomBar';
import {
  creatorReducer,
  reset,
  setLink,
  setLoading,
  setName,
  setParserError,
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
          { step: null, link: '', name: '', loading: false, parseError: false },
          { type: stepToEnterUrl }
        )
      ).toMatchSnapshot();
    });

    it('should handle stepToEnterName', () => {
      expect(
        creatorReducer(
          { step: null, link: '', name: '', loading: false, parseError: false },
          { type: stepToEnterName }
        )
      ).toMatchSnapshot();
    });

    it('should handle reset', () => {
      expect(
        creatorReducer(
          {
            step: Step.EnterUrl,
            link: 'link',
            name: 'name',
            loading: true,
            parseError: true,
          },
          { type: reset }
        )
      ).toMatchSnapshot();
    });

    it('should handle setLink', () => {
      expect(
        creatorReducer(
          { step: null, link: '', name: '', loading: false, parseError: false },
          { type: setLink, payload: 'link' }
        )
      ).toMatchSnapshot();
    });

    it('should handle setName', () => {
      expect(
        creatorReducer(
          { step: null, link: '', name: '', loading: false, parseError: false },
          { type: setName, payload: 'name' }
        )
      ).toMatchSnapshot();
    });

    it('should handle setParserError', () => {
      expect(
        creatorReducer(
          { step: null, link: '', name: '', loading: false, parseError: false },
          { type: setParserError, payload: true }
        )
      ).toMatchSnapshot();
    });

    it('should handle setLoading', () => {
      expect(
        creatorReducer(
          { step: null, link: '', name: '', loading: false, parseError: false },
          { type: setLoading, payload: true }
        )
      ).toMatchSnapshot();
    });

    it('should handle unknown action type', () => {
      expect(
        creatorReducer(
          { step: null, link: '', name: '', loading: false, parseError: false },
          { type: 'unknown' }
        )
      ).toMatchSnapshot();
    });
  });
});

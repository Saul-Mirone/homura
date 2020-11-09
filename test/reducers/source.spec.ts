import { AnyAction } from 'redux';
import 'regenerator-runtime/runtime';
import {
  setCurrentSource,
  sourceReducer,
  State,
} from '../../app/features/source/sourceSlice';

describe('reducers', () => {
  describe('source', () => {
    it('should handle initial state', () => {
      expect(sourceReducer(undefined, {} as AnyAction)).toMatchSnapshot();
    });

    it('should handle setCurrentSource', () => {
      expect(
        sourceReducer({ activeId: null } as State, {
          type: setCurrentSource,
          payload: 1,
        })
      ).toMatchSnapshot();
    });

    it('should handle unknown action type', () => {
      expect(
        sourceReducer({ subscribeStep: null } as State, { type: 'unknown' })
      ).toMatchSnapshot();
    });
  });
});

import { AnyAction } from 'redux';
import { Step } from '../../app/components/SideBar/BottomBar';
import { Status } from '../../app/constants/Status';
import {
  fetchSources,
  resetSubscribeError,
  resetSubscribeState,
  searchUrlForSource,
  setCurrentSource,
  showSubscribeBar,
  sourceReducer,
  State,
  subscribeToSource,
  syncSources,
  unsubscribeById,
  updateSourceById,
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

    it('should handle showSubscribeBar', () => {
      expect(
        sourceReducer({ activeId: null } as State, {
          type: showSubscribeBar,
        })
      ).toMatchSnapshot();
    });

    it('should handle resetSubscribeError', () => {
      expect(
        sourceReducer({ subscribeError: 'subscribeError' } as State, {
          type: resetSubscribeError,
        })
      ).toMatchSnapshot();
    });

    it('should handle resetSubscribeState', () => {
      expect(
        sourceReducer(
          {
            subscribeStep: Step.EnterName,
            subscribeLink: 'fake-link',
            subscribeName: 'fake-name',
            subscribeError: 'subscribeError',
            subscribeStatus: Status.Succeeded,
          } as State,
          {
            type: resetSubscribeState,
          }
        )
      ).toMatchSnapshot();
    });

    it('should handle unknown action type', () => {
      expect(
        sourceReducer({ subscribeStep: null } as State, { type: 'unknown' })
      ).toMatchSnapshot();
    });

    describe('thunk', () => {
      describe('fetchSources', () => {
        it('should handle fetchSources.pending', () => {
          expect(
            sourceReducer(
              {
                fetchListStatus: Status.Idle,
              } as State,
              {
                type: fetchSources.pending,
              }
            )
          ).toMatchSnapshot();
        });

        it('should handle fetchSources.fulfilled', () => {
          expect(
            sourceReducer(
              {
                fetchListStatus: Status.Idle,
              } as State,
              {
                type: fetchSources.fulfilled,
                payload: [
                  {
                    name: 'fake-data',
                  },
                ],
              }
            )
          ).toMatchSnapshot();
        });

        it('should handle fetchSources.rejected', () => {
          expect(
            sourceReducer(
              {
                fetchListStatus: Status.Idle,
              } as State,
              {
                type: fetchSources.rejected,
              }
            )
          ).toMatchSnapshot();
        });
      });

      describe('syncSources', () => {
        it('should handle syncSources.pending', () => {
          expect(
            sourceReducer(
              {
                fetchListStatus: Status.Idle,
              } as State,
              {
                type: syncSources.pending,
              }
            )
          ).toMatchSnapshot();
        });

        it('should handle syncSources.fulfilled', () => {
          expect(
            sourceReducer(
              {
                fetchListStatus: Status.Idle,
              } as State,
              {
                type: syncSources.fulfilled,
                payload: [
                  {
                    name: 'fake-data',
                  },
                ],
              }
            )
          ).toMatchSnapshot();
        });

        it('should handle syncSources.rejected', () => {
          expect(
            sourceReducer(
              {
                fetchListStatus: Status.Idle,
              } as State,
              {
                type: syncSources.rejected,
              }
            )
          ).toMatchSnapshot();
        });
      });

      describe('unsubscribeById', () => {
        it('should handle unsubscribeById.fulfilled', () => {
          expect(
            sourceReducer(
              {
                activeId: 2,
                list: [
                  { id: 1, name: 'data-1' },
                  { id: 2, name: 'data-2' },
                ],
              } as State,
              {
                type: unsubscribeById.fulfilled,
                payload: 2,
              }
            )
          ).toMatchSnapshot();
        });
      });

      describe('updateSourceById', () => {
        it('should handle updateSourceById.fulfilled', () => {
          expect(
            sourceReducer(
              {
                activeId: 2,
                list: [
                  { id: 1, name: 'data-1' },
                  { id: 2, name: 'data-2' },
                ],
              } as State,
              {
                type: updateSourceById.fulfilled,
                payload: {
                  id: 2,
                  name: 'next-data-2',
                },
              }
            )
          ).toMatchSnapshot();
        });
      });

      describe('searchUrlForSource', () => {
        it('should handle searchUrlForSource.pending', () => {
          expect(
            sourceReducer(
              {
                subscribeLink: '',
                subscribeStatus: Status.Idle,
              } as State,
              {
                type: searchUrlForSource.pending,
                meta: {
                  arg: 'fake-link',
                },
              }
            )
          ).toMatchSnapshot();
        });

        it('should handle searchUrlForSource.fulfilled', () => {
          expect(
            sourceReducer(
              {
                subscribeName: '',
                subscribeStatus: Status.Idle,
              } as State,
              {
                type: searchUrlForSource.fulfilled,
                payload: 'fake-name',
              }
            )
          ).toMatchSnapshot();
        });

        it('should handle searchUrlForSource.rejected', () => {
          expect(
            sourceReducer(
              {
                subscribeError: null,
                subscribeStatus: Status.Idle,
              } as State,
              {
                type: searchUrlForSource.rejected,
                payload: 'fake-error',
              }
            )
          ).toMatchSnapshot();
        });
      });

      describe('subscribeToSource', () => {
        it('should handle subscribeToSource.fulfilled', () => {
          expect(
            sourceReducer(
              {
                activeId: 4,
                subscribeError: 'fake-error',
                subscribeStatus: Status.Idle,
                subscribeLink: 'fake-link',
                subscribeName: 'fake-name',
                list: [{ id: 4 }],
              } as State,
              {
                type: subscribeToSource.fulfilled,
                payload: {
                  id: 1,
                  name: 'fake-data-1',
                },
              }
            )
          ).toMatchSnapshot();
        });
      });
    });
  });
});

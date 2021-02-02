import { AnyAction } from 'redux';

// organize-imports-ignore
import { mockChannel } from '../test-tools/mockChannel';

import { getPostContentById, postReducer } from '../../src/features/post/postSlice';
import { Post } from '../../src/model/types';
import { formatActions } from '../test-tools/formatActions';
import { mockStore } from '../test-tools/mockStore';

describe('reducers', () => {
    describe('post', () => {
        it('should handle initial state', () => {
            expect(postReducer(undefined, {} as AnyAction)).toMatchSnapshot();
        });

        describe('thunk', () => {
            describe('getPostContentById', () => {
                it('should action list match snapshot', async () => {
                    const store = mockStore();
                    mockChannel.getPostById.mockReturnValue(({ content: 'test-content' } as unknown) as Post);
                    await store.dispatch(getPostContentById(123));
                    expect(formatActions(store)).toMatchSnapshot();
                });
                it('should handle getPostContentById.fulfilled', () => {
                    expect(
                        postReducer(
                            {
                                content: '',
                            },
                            {
                                type: getPostContentById.fulfilled,
                                payload: {
                                    content: 'fake-content',
                                },
                            },
                        ),
                    ).toMatchSnapshot();
                });
            });
        });
    });
});

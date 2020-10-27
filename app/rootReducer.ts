import { combineReducers } from 'redux';
import { creatorReducer } from './features/creator/creatorSlice';
import { listReducer } from './features/list/listSlice';
import { modeReducer } from './features/mode/modeSlice';
import { postReducer } from './features/post/postSlice';
import { sourceReducer } from './features/source/sourceSlice';

export function createRootReducer() {
  return combineReducers({
    mode: modeReducer,
    source: sourceReducer,
    creator: creatorReducer,
    list: listReducer,
    post: postReducer,
  });
}

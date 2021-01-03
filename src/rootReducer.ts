import { combineReducers } from 'redux';
import { listReducer } from './features/list/listSlice';
import { modeReducer } from './features/mode/modeSlice';
import { postReducer } from './features/post/postSlice';
import { sourceReducer } from './features/source/sourceSlice';

export function createRootReducer() {
  return combineReducers({
    mode: modeReducer,
    source: sourceReducer,
    list: listReducer,
    post: postReducer,
  });
}

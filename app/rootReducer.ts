import { combineReducers } from 'redux';
import { sourceReducer } from './features/source/sourceSlice';
import { modeReducer } from './features/mode/modeSlice';

export function createRootReducer() {
  return combineReducers({
    mode: modeReducer,
    source: sourceReducer,
  });
}

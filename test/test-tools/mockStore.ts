import { Store as ReduxStore } from 'redux';
import configureMockStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { Store } from '../../app/store';

type State<S> = S extends ReduxStore<infer A, any> ? A : never;
type Action<S> = S extends ReduxStore<any, infer A> ? A : never;

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

type DispatchExt = ThunkDispatch<State<Store>, void, Action<Store>>;

export const mockStore = configureMockStore<
  DeepPartial<State<Store>>,
  DispatchExt
>([thunk]);

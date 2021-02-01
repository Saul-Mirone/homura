import React from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreator, bindActionCreators } from 'redux';
import { AppDispatch } from '../store';

/**
 * From https://react-redux.js.org/api/hooks#recipe-useactions
 */
export function useActions<T extends ActionCreator<unknown>[]>(actions: T, deps: unknown[] = []): T {
    const dispatch = useDispatch<AppDispatch>();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return React.useMemo(() => actions.map((a) => bindActionCreators(a, dispatch)) as T, deps.concat(dispatch));
}

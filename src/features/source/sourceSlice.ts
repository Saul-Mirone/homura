import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { channel } from '../../channel/child';
import { Step } from '../../components/SideBar/BottomBar';
import { Mode } from '../../constants/Mode';
import { Preset } from '../../constants/Preset';
import { Status } from '../../constants/Status';
import { Source } from '../../model/types';
import type { RootState } from '../../store';

type SourceKeys = 'id' | 'name' | 'link' | 'icon';
type SourceItem = Pick<Source, SourceKeys> & { count: number };

type SourceListState = {
    activeId: number | Preset | undefined;
    list: SourceItem[];
    fetchListStatus: Status;
    syncListStatus: Status;
};

type SourceSubscribeState = {
    subscribeLink: string;
    subscribeName: string;
    subscribeStatus: Status;
    subscribeStep: Step | undefined;
    subscribeError: string | undefined;
};

export type State = SourceListState & SourceSubscribeState;

const initialSourceList: SourceListState = {
    list: [],
    activeId: undefined,
    fetchListStatus: Status.Idle,
    syncListStatus: Status.Idle,
};

const initialSourceSubscribeState: SourceSubscribeState = {
    subscribeLink: '',
    subscribeName: '',
    subscribeStep: undefined,
    subscribeStatus: Status.Idle,
    subscribeError: undefined,
};

const initialState: State = {
    ...initialSourceList,
    ...initialSourceSubscribeState,
};

const fetchSourceListAPI = (mode: Mode) => {
    const countType = mode === Mode.Starred ? 'starred' : 'unread';
    return channel.getSourceList(countType);
};

export const fetchSources = createAsyncThunk('source/fetchSources', (mode: Mode) => fetchSourceListAPI(mode));

export const syncSources = createAsyncThunk('source/syncSources', () => channel.sync());

export const unsubscribeById = createAsyncThunk('source/unsubscribeById', async (id: number) => {
    await channel.removeSourceById(id);
    return id;
});

export const updateSourceById = createAsyncThunk(
    'source/updateSourceById',
    async ({ id, name }: { id: number; name: string }) => {
        await channel.updateSourceNameById(id, name);

        return { id, name };
    },
);

export const searchUrlForSource = createAsyncThunk('source/searchUrlForSource', async (link: string) => {
    const result = await channel.checkUrl(link);
    if (!result) {
        throw new Error('ParseRSSFailed');
    }
    return result;
});

export const subscribeToSource = createAsyncThunk(
    'source/subscribeToSource',
    async ({ name, mode }: { name: string; mode: Mode }) => {
        const { count, icon, link, id } = await channel.confirm(name);

        return {
            id,
            name,
            link,
            icon,
            count: mode === Mode.Starred ? 0 : count,
        };
    },
);

const sourceSlice = createSlice({
    name: 'source',
    initialState,
    reducers: {
        setCurrentSource: (state, action: PayloadAction<number | Preset | undefined>) => {
            state.activeId = action.payload;
        },
        showSubscribeBar: (state) => {
            state.subscribeStep = Step.EnterUrl;
            state.subscribeStatus = Status.Idle;
        },
        resetSubscribeError: (state) => {
            state.subscribeError = undefined;
        },
        resetSubscribeState: (state) => {
            state.subscribeStep = undefined;
            state.subscribeError = undefined;
            state.subscribeLink = '';
            state.subscribeName = '';
            state.subscribeStatus = Status.Idle;
        },

        setCountToZero: (state, action: PayloadAction<number>) => {
            const target = state.list.find((x) => x.id === action.payload);
            if (!target) return;
            target.count = 0;
        },
        incCount: (state, action: PayloadAction<number>) => {
            const target = state.list.find((x) => x.id === action.payload);
            if (!target) return;
            target.count += 1;
        },
        decCount: (state, action: PayloadAction<number>) => {
            const target = state.list.find((x) => x.id === action.payload);
            if (!target) return;
            target.count -= 1;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(fetchSources.pending, (state) => {
                state.fetchListStatus = Status.Pending;
            })
            .addCase(fetchSources.fulfilled, (state, action) => {
                state.fetchListStatus = Status.Succeeded;
                state.list = action.payload;
            })
            .addCase(fetchSources.rejected, (state) => {
                state.fetchListStatus = Status.Failed;
            })
            .addCase(syncSources.pending, (state) => {
                state.syncListStatus = Status.Pending;
            })
            .addCase(syncSources.fulfilled, (state) => {
                state.syncListStatus = Status.Succeeded;
            })
            .addCase(syncSources.rejected, (state) => {
                state.syncListStatus = Status.Failed;
            })
            .addCase(unsubscribeById.fulfilled, (state, action) => {
                state.activeId = undefined;
                state.list = state.list.filter((x) => x.id !== action.payload);
            })
            .addCase(updateSourceById.fulfilled, (state, action) => {
                state.activeId = undefined;
                const target = state.list.find((x) => x.id === action.payload.id);
                if (!target) return;
                target.name = action.payload.name;
            })
            .addCase(searchUrlForSource.pending, (state, action) => {
                state.subscribeLink = action.meta.arg;
                state.subscribeStatus = Status.Pending;
            })
            .addCase(searchUrlForSource.fulfilled, (state, action) => {
                state.subscribeName = action.payload;
                state.subscribeStep = Step.EnterName;
            })
            .addCase(searchUrlForSource.rejected, (state, action) => {
                state.subscribeStatus = Status.Failed;
                state.subscribeError = action.error.message ?? 'Unknown Error';
            })
            .addCase(subscribeToSource.fulfilled, (state, action) => {
                const { id } = action.payload;
                state.subscribeStatus = Status.Succeeded;
                state.list.push(action.payload);
                state.activeId = id;
                state.subscribeStep = undefined;
                state.subscribeError = undefined;
                state.subscribeLink = '';
                state.subscribeName = '';
            }),
});

export const {
    setCurrentSource,
    resetSubscribeError,
    resetSubscribeState,
    showSubscribeBar,
    setCountToZero,
    decCount,
    incCount,
} = sourceSlice.actions;

export const sourceReducer = sourceSlice.reducer;

export const selectSourceList = (state: RootState) => {
    const { source, mode } = state;
    const totalCount = source.list.reduce((acc, cur) => acc + cur.count, 0);
    const { list, activeId, syncListStatus } = source;

    return {
        activeId,
        totalCount,
        mode,
        syncStatus: syncListStatus,
        list: list.filter((x) => {
            if (mode === Mode.All || activeId === x.id) return true;
            return x.count > 0;
        }),
    };
};

export const selectSourceOperation = (state: RootState) => {
    const { source, mode } = state;
    const {
        subscribeLink,
        subscribeName,
        subscribeStep,
        subscribeStatus,
        subscribeError,
        fetchListStatus,
        syncListStatus,
    } = source;
    const loading =
        subscribeStatus === Status.Pending || fetchListStatus === Status.Pending || syncListStatus === Status.Pending;
    return {
        mode,
        subscribeLink,
        subscribeName,
        subscribeStep,
        subscribeError,
        loading,
    };
};

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { storage } from './storage';
import { FIRST_DAY } from '@/data/days';

const STORAGE_KEY = 'boki:progress:v2';

const today = () => new Date().toISOString().slice(0, 10);

export interface GameState {
  /** false until we've loaded persisted progress. */
  hydrated: boolean;
  /** the day the player currently has open. */
  currentDay: number;
  /** day number -> how many of that day's events are completed. */
  dayProgress: Record<number, number>;
  /** eventId -> was the FIRST attempt correct. */
  answers: Record<string, boolean>;
  /** day numbers the player has finished (reached the CLEAR screen for). */
  completedDays: number[];
  /** day number -> ISO date it was first completed. */
  completedAt: Record<number, string>;
  /** ISO date of the last time the player did anything. */
  lastPlayedAt: string | null;
  /** name shown on the 修了証 (free text, local only). */
  name: string;
}

const initialState: GameState = {
  hydrated: false,
  currentDay: FIRST_DAY,
  dayProgress: {},
  answers: {},
  completedDays: [],
  completedAt: {},
  lastPlayedAt: null,
  name: '',
};

/** the fields we persist / import / export (everything except `hydrated`). */
export type PersistedState = Omit<GameState, 'hydrated'>;

type Action =
  | { type: 'hydrate'; payload: Partial<GameState> }
  | { type: 'import'; payload: Partial<PersistedState> }
  | { type: 'openDay'; day: number }
  | { type: 'answer'; eventId: string; correct: boolean }
  | { type: 'advance'; day: number }
  | { type: 'completeDay'; day: number }
  | { type: 'setName'; name: string }
  | { type: 'reset' };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.payload, hydrated: true };

    case 'import':
      return { ...initialState, ...action.payload, hydrated: true };

    case 'openDay':
      if (state.currentDay === action.day) return state;
      return { ...state, currentDay: action.day };

    case 'answer':
      if (action.eventId in state.answers) {
        return { ...state, lastPlayedAt: today() };
      }
      return {
        ...state,
        answers: { ...state.answers, [action.eventId]: action.correct },
        lastPlayedAt: today(),
      };

    case 'advance':
      return {
        ...state,
        dayProgress: {
          ...state.dayProgress,
          [action.day]: (state.dayProgress[action.day] ?? 0) + 1,
        },
        lastPlayedAt: today(),
      };

    case 'completeDay': {
      const alreadyDay = state.completedDays.includes(action.day);
      const alreadyStamped = action.day in state.completedAt;
      if (alreadyDay && alreadyStamped && state.lastPlayedAt === today()) {
        return state;
      }
      return {
        ...state,
        completedDays: alreadyDay
          ? state.completedDays
          : [...state.completedDays, action.day].sort((a, b) => a - b),
        completedAt: alreadyStamped
          ? state.completedAt
          : { ...state.completedAt, [action.day]: today() },
        lastPlayedAt: today(),
      };
    }

    case 'setName':
      if (state.name === action.name) return state;
      return { ...state, name: action.name };

    case 'reset':
      return { ...initialState, hydrated: true };

    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  openDay: (day: number) => void;
  recordAnswer: (eventId: string, correct: boolean) => void;
  advance: (day: number) => void;
  completeDay: (day: number) => void;
  setName: (name: string) => void;
  resetAll: () => void;
  importState: (payload: Partial<PersistedState>) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // load once
  useEffect(() => {
    let cancelled = false;
    storage.get<Partial<GameState>>(STORAGE_KEY).then((saved) => {
      if (cancelled) return;
      const { hydrated: _ignore, ...rest } = saved ?? {};
      dispatch({ type: 'hydrate', payload: rest });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // persist on change
  useEffect(() => {
    if (!state.hydrated) return;
    const { hydrated: _drop, ...persistable } = state;
    storage.set(STORAGE_KEY, persistable);
  }, [state]);

  // dispatch is stable -> these keep a stable identity across renders.
  const openDay = useCallback((day: number) => dispatch({ type: 'openDay', day }), []);
  const recordAnswer = useCallback(
    (eventId: string, correct: boolean) =>
      dispatch({ type: 'answer', eventId, correct }),
    [],
  );
  const advance = useCallback((day: number) => dispatch({ type: 'advance', day }), []);
  const completeDay = useCallback(
    (day: number) => dispatch({ type: 'completeDay', day }),
    [],
  );
  const setName = useCallback((name: string) => dispatch({ type: 'setName', name }), []);
  const resetAll = useCallback(() => dispatch({ type: 'reset' }), []);
  const importState = useCallback(
    (payload: Partial<PersistedState>) => dispatch({ type: 'import', payload }),
    [],
  );

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      openDay,
      recordAnswer,
      advance,
      completeDay,
      setName,
      resetAll,
      importState,
    }),
    [state, openDay, recordAnswer, advance, completeDay, setName, resetAll, importState],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within <GameProvider>');
  return ctx;
}

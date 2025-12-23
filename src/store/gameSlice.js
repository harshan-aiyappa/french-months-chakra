// ============================================================================
// REDUX GAME SLICE - State Management for French Months Game
// ============================================================================

import { createSlice } from '@reduxjs/toolkit';
import { UNIT_DATA } from '../constants';

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState = {
    status: 'start', // 'start' | 'calibrating' | 'playing' | 'results'
    mode: 'mixed', // 'mixed' | 'speech' | 'mcq'
    currentIndex: 0,
    history: [], // Array of session results
    retryCount: 0,
    dynamicThreshold: 30,
    isCalibrated: false,
    feedback: {
        message: '',
        type: '',
        highlightedPhrase: [],
    },
};

// ============================================================================
// SLICE DEFINITION
// ============================================================================

export const gameSlice = createSlice({
    name: 'game',
    initialState,

    // ========================================================================
    // REDUCERS (Actions)
    // ========================================================================
    reducers: {
        setMode: (state, action) => {
            state.mode = action.payload;
        },
        startGame: (state, action) => {
            const mode = action.payload || 'mixed';
            state.mode = mode;
            state.currentIndex = 0;
            state.history = [];
            state.retryCount = 0;
            state.feedback = { message: '', type: '', highlightedPhrase: [] };

            // BEST APPROACH: Calibrate once per unit (unless MCQ-only)
            if (mode === 'mcq') {
                state.status = 'playing';
            } else if (!state.isCalibrated || mode !== state.mode) {
                state.isCalibrated = false;
                state.status = 'calibrating';
            } else {
                state.status = 'playing';
            }
        },
        setCalibrationComplete: (state, action) => {
            state.dynamicThreshold = action.payload;
            state.isCalibrated = true;
            state.status = 'playing';
        },
        submitResult: (state, action) => {
            state.history.push(action.payload);
        },
        setFeedback: (state, action) => {
            state.feedback = action.payload;
        },
        nextActivity: (state) => {
            state.feedback = { message: '', type: '', highlightedPhrase: [] };
            state.retryCount = 0;

            const activeData = selectActiveUnitData({ game: state });
            if (state.currentIndex < activeData.length - 1) {
                state.currentIndex += 1;
            } else {
                state.status = 'results';
            }
        },
        retryCurrent: (state) => {
            state.history.pop(); // Remove last result
            state.feedback = { message: '', type: '', highlightedPhrase: [] };
        },
        incrementRetry: (state) => {
            state.retryCount += 1;
        },
        triggerRecalibration: (state) => {
            state.isCalibrated = false;
            state.status = 'calibrating';
        },
        resetGame: (state) => {
            return initialState;
        },
    },
});

// ============================================================================
// ACTIONS EXPORT
// ============================================================================

export const {
    setMode,
    startGame,
    setCalibrationComplete,
    submitResult,
    setFeedback,
    nextActivity,
    retryCurrent,
    incrementRetry,
    triggerRecalibration,
    resetGame,
} = gameSlice.actions;

// Selectors
export const selectGameStatus = (state) => state.game.status;
export const selectGameMode = (state) => state.game.mode;
export const selectCurrentIndex = (state) => state.game.currentIndex;
export const selectHistory = (state) => state.game.history;
export const selectRetryCount = (state) => state.game.retryCount;
export const selectDynamicThreshold = (state) => state.game.dynamicThreshold;
export const selectIsCalibrated = (state) => state.game.isCalibrated;
export const selectFeedback = (state) => state.game.feedback;

// Memoized selectors
export const selectActiveUnitData = (state) => {
    const mode = state.game.mode;
    if (mode === 'speech') return UNIT_DATA.filter((a) => a.type === 'SPEAKING');
    if (mode === 'mcq') return UNIT_DATA.filter((a) => a.type === 'MCQ');
    return UNIT_DATA;
};

export const selectCurrentActivity = (state) => {
    const activeData = selectActiveUnitData(state);
    return activeData[state.game.currentIndex] || activeData[0];
};

export const selectScore = (state) => {
    return state.game.history.filter((r) => r.status === 'correct').length;
};

export const selectProgress = (state) => {
    const activeData = selectActiveUnitData(state);
    return (state.game.history.length / activeData.length) * 100;
};

export const selectTotal = (state) => {
    return selectActiveUnitData(state).length;
};

export default gameSlice.reducer;

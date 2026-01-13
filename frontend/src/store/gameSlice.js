// ============================================================================
// REDUX GAME SLICE - State Management for French Months Game
// ============================================================================
//
// PURPOSE:
// Centralized state management for the entire game flow using Redux Toolkit.
// Handles game mode selection, activity progression, calibration status,
// user feedback, and session history.
//
// STATE STRUCTURE:
// - status: Current game phase ('start' | 'calibrating' | 'playing' | 'results')
// - mode: Selected game mode ('mixed' | 'speech' | 'mcq')
// - currentIndex: Index of current activity in the filtered activity list
// - history: Array of completed activity results (for scoring)
// - retryCount: Number of retry attempts for current activity
// - dynamicThreshold: Calibrated audio threshold for VAD (Voice Activity Detection)
// - isCalibrated: Whether microphone calibration has been completed
// - feedback: Current user feedback (message, type, highlighted phrase)
//
// KEY FEATURES:
// - Memoized selectors for optimized performance
// - Mode-specific activity filtering (speaking/MCQ/mixed)
// - Unit-level calibration (calibrate once, reuse threshold)
// - Smart re-calibration on repeated failures
//
// ============================================================================

import { createSlice, createSelector } from '@reduxjs/toolkit';
import { UNIT_DATA } from '../constants';

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState = {
    status: 'start', // 'start' | 'calibrating' | 'playing' | 'results'
    mode: 'mixed', // 'mixed' | 'speech' | 'mcq'
    asrMode: 'native', // 'native' | 'hybrid' | 'auto'
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
    activityQueue: [], // Pre-shuffled or ordered list of activities
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
            const { mode = 'mixed', asrMode = 'native' } = action.payload || {};
            state.mode = mode;
            state.asrMode = asrMode;
            state.currentIndex = 0;
            state.history = [];
            state.retryCount = 0;
            state.feedback = { message: '', type: '', highlightedPhrase: [] };

            // Generate Activity Queue
            let data = [...UNIT_DATA];
            if (mode === 'speech') {
                data = UNIT_DATA.filter((a) => a.type === 'SPEAKING');
            } else if (mode === 'mcq') {
                data = UNIT_DATA.filter((a) => a.type === 'MCQ');
            } else {
                // Mixed Mode: Filter invalid items if any, then SHUFFLE
                // (Assuming UNIT_DATA has both. We include all.)
                // Fisher-Yates Shuffle
                for (let i = data.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [data[i], data[j]] = [data[j], data[i]];
                }
            }
            state.activityQueue = data;

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

            if (state.currentIndex < state.activityQueue.length - 1) {
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
export const selectAsrMode = (state) => state.game.asrMode;
export const selectFeedback = (state) => state.game.feedback;

// Memoized selectors
export const selectActiveUnitData = (state) => state.game.activityQueue;

export const selectCurrentActivity = (state) => {
    const activeData = selectActiveUnitData(state);
    return activeData[state.game.currentIndex] || activeData[0];
};

export const selectScore = createSelector(
    [selectHistory],
    (history) => history.filter((r) => r.status === 'correct').length
);

export const selectProgress = createSelector(
    [selectHistory, selectActiveUnitData],
    (history, activeData) => {
        if (!activeData || activeData.length === 0) return 0;
        return (history.length / activeData.length) * 100;
    }
);

export const selectTotal = createSelector(
    [selectActiveUnitData],
    (activeData) => activeData ? activeData.length : 0
);

export default gameSlice.reducer;

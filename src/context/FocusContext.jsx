import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const FocusContext = createContext();

export const useFocus = () => {
    const context = useContext(FocusContext);
    if (!context) throw new Error('useFocus must be used within a FocusProvider');
    return context;
};

export const FocusProvider = ({ children }) => {
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
    const [mode, setMode] = useState('focus'); // 'focus' or 'break'
    const [completedSessions, setCompletedSessions] = useState(() => {
        const saved = localStorage.getItem('hustleboard_focus_sessions');
        return saved ? JSON.parse(saved) : [];
    });

    const timerRef = useRef(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleSessionComplete();
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]);

    const handleSessionComplete = () => {
        setIsActive(false);
        if (mode === 'focus') {
            const newSession = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                duration: 25,
                type: 'focus'
            };
            const updated = [...completedSessions, newSession];
            setCompletedSessions(updated);
            localStorage.setItem('hustleboard_focus_sessions', JSON.stringify(updated));
            alert('Focus session complete! Take a break.');
            setMode('break');
            setTimeLeft(5 * 60);
        } else {
            alert('Break over! Ready to focus?');
            setMode('focus');
            setTimeLeft(25 * 60);
        }
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <FocusContext.Provider value={{
            isActive,
            timeLeft,
            mode,
            completedSessions,
            toggleTimer,
            resetTimer,
            formatTime,
            setMode,
            setTimeLeft
        }}>
            {children}
        </FocusContext.Provider>
    );
};

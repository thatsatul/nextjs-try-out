'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';

const HomeContainer: React.FC = () => {
    // Example usage of Redux hooks (replace with your actual slice)
        const value = useSelector((state: RootState) => (state.test as { value: any }).value);
        const dispatch = useDispatch<AppDispatch>();

    return (
        <div>
            <h1>Welcome to Finance Calc</h1>
            <p>This is the home page.</p>
            <p onClick={() => dispatch({ type: 'test/increment' })}>Redux value: {value}</p>
            <p onClick={() => dispatch({ type: 'test/setValue', payload: 0 })}>Reset</p>
        </div>
    );
};

export default HomeContainer;

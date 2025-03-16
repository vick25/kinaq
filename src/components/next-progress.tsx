'use client'

import React from 'react'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const NextProgress = () => (
    <ProgressBar
        height="4px"
        color="#05b15d"
        options={{ showSpinner: false }}
        shallowRouting
    />
)

export default NextProgress
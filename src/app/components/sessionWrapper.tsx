"use client"

import { Provider } from "react-redux"
import { store } from "../redux/store"

const SessionWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>{ children }</Provider>
    )
}

export default SessionWrapper
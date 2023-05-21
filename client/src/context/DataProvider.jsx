import { createContext, useContext, useEffect, useState } from "react"
import axios from 'axios'

const DataContext = createContext(null)

export const useData = () => {
    return useContext(DataContext)
}

const DataProvider = ({ children }) => {

    const [auth, setAuth] = useState('')
    const [openSideBar, setOpenSideBar] = useState(false)
    const [openLoginDialog, setOpenLoginDialog] = useState(false)
    const [openAccountInfoDialog, setOpenAccountInfoDialog] = useState(false)
    const [openAccountEditDialog, setOpenAccountEditDialog] = useState(false)
    const [render, setRender] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [openSearchDialog, setOpenSearchDialog] = useState(false)
    const [listening, setListening] = useState(false)

    axios.defaults.headers.common["Authorization"] = auth?.token;

    useEffect(() => {
        const auth = JSON.parse(localStorage.getItem('auth'))
        if (auth) {
            setAuth(auth)
        }
    }, [])

    return (
        <DataContext.Provider value={{
            auth, setAuth,
            render, setRender,
            openSideBar, setOpenSideBar,
            searchValue, setSearchValue,
            openLoginDialog, setOpenLoginDialog,
            openAccountInfoDialog, setOpenAccountInfoDialog,
            openAccountEditDialog, setOpenAccountEditDialog,
            openSearchDialog, setOpenSearchDialog,
            listening, setListening
        }} >
            {children}
        </DataContext.Provider>
    )
}

export default DataProvider
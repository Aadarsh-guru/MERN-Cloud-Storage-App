import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataProvider'

const ProtectedRoutes = () => {

    const { auth } = useData()
    const navigate = useNavigate()

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('auth'))
        if (!token) {
            navigate('/')
        }
        // eslint-disable-next-line
    }, [auth])
    return (
        <Outlet />
    )
}

export default ProtectedRoutes

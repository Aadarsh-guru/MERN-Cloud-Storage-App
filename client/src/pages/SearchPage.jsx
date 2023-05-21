import { useData } from '../context/DataProvider'
import Layout from '../layout/Layout'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, CircularProgress, styled } from '@mui/material'
import HomeMediaCard from '../components/HomeMediaCard'

const Container = styled(Box)({
    height: 'calc(100vh - 120px)',
    width: '100vw',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    margin: '20px 0',
    overflow: 'auto',
    rowGap: 20,
    scrollBehavior: 'smooth'
})


const SearchPage = () => {

    const { render, searchValue } = useData()
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getAllFiles = async () => {
            setLoading(true)
            const response = await axios.get(`/api/v1/media/search/${searchValue}`)
            response && setTimeout(() => setLoading(false), 500)
            if (response.data.success) {
                setFiles(response.data.files)
            }
        }
        getAllFiles()
        // eslint-disable-next-line
    }, [render])


    return (
        <Layout title={'Search Page - MyCloud'}>
            <Box sx={{ width: '100vw', display: `flex`, justifyContent: 'center', padding: '5px', background: 'grey', fontSize: 20, fontWeight: 600, color: '#ffffff' }} >
                {searchValue ? `Search Results For '${searchValue}'` : `Your Search Results`}
            </Box >
            <Container>
                {
                    loading ?
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircularProgress />
                        </Box>
                        : files?.length <= 0 ?
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {searchValue ? `Serch Results for '${searchValue}' not found.` : `Search results not found`}
                            </Box>
                            :
                            files?.map(file => (
                                <HomeMediaCard key={file?._id} file={file} />
                            ))
                }
            </Container>
        </Layout>
    )
}

export default SearchPage
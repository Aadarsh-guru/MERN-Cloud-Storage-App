import { useData } from '../context/DataProvider'
import Layout from '../layout/Layout'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, CircularProgress, styled } from '@mui/material'
import UserMediaCard from '../components/UserMediaCard'

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


const YourVideos = () => {

    const { render, auth } = useData()
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getAllFiles = async () => {
            setLoading(true)
            const response = await axios.get('/api/v1/media/get-user-media')
            response && setTimeout(() => setLoading(false), 500)
            if (response.data.success) {
                const filterFiles = response?.data?.files.filter(e => e.contentType.includes('video'))
                setFiles(filterFiles)
            }
        }
        getAllFiles()
    }, [render, auth])


    return (
        <Layout title={'Your Videos - MyCloud'}>
            <Box sx={{ width: '100vw', display: `flex`, justifyContent: 'center', padding: '5px', background: 'grey', fontSize: 20, fontWeight: 600, color: '#ffffff' }} >
                Your Videos
            </Box >
            <Container>
                {
                    loading ?
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircularProgress />
                        </Box>
                        : files?.length <= 0 ?
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                No Videos to display. Upload Content to see result here.
                            </Box>
                            :
                            files?.map(file => (
                                <UserMediaCard key={file?._id} file={file} />
                            ))
                }
            </Container>
        </Layout>
    )
}

export default YourVideos
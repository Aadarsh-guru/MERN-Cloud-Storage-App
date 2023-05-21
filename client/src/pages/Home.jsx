import { useData } from '../context/DataProvider'
import Layout from '../layout/Layout'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Button, CircularProgress, styled } from '@mui/material'
import HomeMediaCard from '../components/HomeMediaCard'
import toast from 'react-hot-toast'

const Container = styled(Box)({
    height: 'calc(100vh - 100px)',
    width: '100vw',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    margin: '20px 0',
    overflow: 'auto',
    rowGap: 20,
    scrollBehavior: 'smooth'
})


const Home = () => {

    const { render, openLoginDialog } = useData()
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const getAllFiles = async () => {
            setLoading(true)
            const response = await axios.get('/api/v1/media/get-all')
            response && setTimeout(() => setLoading(false), 500)
            if (response.data.success) {
                setFiles(response.data.files)
            }
        }
        getAllFiles()
    }, [render])


    useEffect(() => {
        const loadMore = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`/api/v1/media/more-files/${page}`)
                if (data.success) {
                    setFiles([...files, ...data?.files]);
                    setLoading(false)
                    files?.length === 9 ? toast.success(data.message) : toast.success('No More videos to fetch')
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        if (page === 1) return
        loadMore()
        // eslint-disable-next-line
    }, [page])


    return (
        <Layout title={openLoginDialog ? 'Login Page - MyCloud' : 'Home Page - MyCloud'}>
            <Container>
                {
                    loading ?
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircularProgress />
                        </Box>
                        : files?.length <= 0 ?
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                No Public Content to display. Upload Content to see result here.
                            </Box>
                            :
                            files?.map(file => (
                                <HomeMediaCard key={file?._id} file={file} />
                            ))
                }
                <Box sx={{ height: '50pxpx', width: '100vw', display: `${files?.length < 9 ? 'none' : 'flex'}`, justifyContent: 'center', alignItems: 'center' }} >
                    <Button onClick={() => setPage(page + 1)} >Load More..</Button>
                </Box>
            </Container>
        </Layout>
    )
}

export default Home
import { Box, Button, Drawer, Typography, styled } from '@mui/material'
import { useData } from '../context/DataProvider'
import { NavLink } from 'react-router-dom'
import { HomeOutlined, Logout, CollectionsOutlined, ArticleOutlined, VideoLibraryOutlined, CloudUploadOutlined } from '@mui/icons-material'


const Wrapper = styled(NavLink)({
    color: '#000',
    textDecoration: "none",
    display: 'flex',
    padding: '10px 20px',
    margin: '20px 10px',
    cursor: 'pointer',
    borderRadius: 10,
    '& > svg': {
        marginRight: 20
    },
    ':hover': {
        background: 'lightgrey',
        color: '#000'
    }
})

const Image = styled('img')({
    width: 100,
    height: 100,
    borderRadius: '50%'
})

const LoginWrapper = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px 0'
})

const LogoutButton = styled(Box)({
    color: '#000',
    display: 'flex',
    padding: '10px 20px',
    margin: 10,
    cursor: 'pointer',
    borderRadius: 10,
    '& > svg': {
        marginRight: 20
    },
    ':hover': {
        background: 'lightgrey',
        color: 'red'
    },
})

const Sidebar = () => {

    const { openSideBar, setOpenSideBar, auth, setAuth, openLoginDialog, setOpenLoginDialog } = useData()
    const handleSignIn = () => {
        setOpenSideBar(!openSideBar)
        setOpenLoginDialog(!openLoginDialog)
    }

    const handleLogout = () => {
        setAuth('')
        localStorage.removeItem('auth')
    }

    return (
        < Drawer anchor='left' open={openSideBar} hideBackdrop={true} ModalProps={{
            keepMounted: true
        }} variant='persistent' sx={{
            '& > .MuiDrawer-paper': {
                marginTop: '64px',
                width: 225,
                background: '#f5f5f5',
                borderRight: 'none',
                height: 'calc(100vh - 64px)'
            }
        }} >
            <Box style={{ marginTop: 20 }}>
                {
                    auth ?
                        (
                            <>

                                <Wrapper to='/' onClick={() => setOpenSideBar(!openSideBar)} >
                                    <HomeOutlined />
                                    <Typography >Home</Typography>
                                </Wrapper>
                                <Wrapper to='/upload' onClick={() => setOpenSideBar(!openSideBar)} >
                                    <CloudUploadOutlined />
                                    <Typography >Upload</Typography>
                                </Wrapper>
                                <Wrapper to='/your-images' onClick={() => setOpenSideBar(!openSideBar)} >
                                    <CollectionsOutlined />
                                    <Typography >Your Images</Typography>
                                </Wrapper>
                                <Wrapper to='/your-docs' onClick={() => setOpenSideBar(!openSideBar)} >
                                    <ArticleOutlined />
                                    <Typography >Your Docs</Typography>
                                </Wrapper>
                                <Wrapper to='/your-videos' onClick={() => setOpenSideBar(!openSideBar)} >
                                    <VideoLibraryOutlined />
                                    <Typography >Your Videos</Typography>
                                </Wrapper>
                                <LogoutButton onClick={() => handleLogout()} >
                                    <Logout />
                                    <Typography>Sign Out</Typography>
                                </LogoutButton>
                            </>
                        )
                        :
                        (
                            <LoginWrapper>
                                <Image src='/images/account.jpg' alt="signin" />
                                <Typography style={{ fontSize: 14, color: 'grey', textAlign: 'center', padding: '10px 5px' }}>Seems You are not
                                    Logged in. Click <Box color='Highlight' component='span'>Sign in</Box> to contineu.
                                </Typography>
                                <Button onClick={() => handleSignIn()} >Sign in</Button>
                            </LoginWrapper>
                        )
                }
            </Box>
        </Drawer>
    )
}

export default Sidebar
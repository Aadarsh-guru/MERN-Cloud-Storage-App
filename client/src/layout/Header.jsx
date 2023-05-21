import { AppBar, Box, InputBase, Toolbar, Typography, styled } from '@mui/material'
import { AccountCircleOutlined, Cloud, CloudUpload, Menu, Mic, Search } from '@mui/icons-material'
import { useData } from '../context/DataProvider'
import { useNavigate } from 'react-router-dom'

const Heading = styled(Box)({
    display: 'flex',
    margin: '0px 20px',
    cursor: 'pointer',
    '& > svg': {
        margin: '3px 5px 5px 5px'
    },
    '& > p': {
        margin: '5px 5px 0px 5px',
        fontSize: 24,
        fontWeight: 600
    }
})

const SearchWrapper = styled('form')({
    border: '1px solid grey',
    margin: '0 0 0 160px',
    borderRadius: 25,
    minWidth: 590,
    maxWidth: 620,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 10px',
    '& > div': {
        width: '100%',
        padding: '0 10px'
    }
})

const RightSection = styled(Box)({
    marginLeft: 'auto',
    '& > svg': {
        cursor: 'pointer'
    }
})

const Header = () => {

    const navigate = useNavigate()

    const {
        setRender, render,
        searchValue, setSearchValue,
        openSideBar, setOpenSideBar,
        auth, openLoginDialog, setOpenLoginDialog,
        openAccountInfoDialog, setOpenAccountInfoDialog,
        setOpenSearchDialog, openSearchDialog,
        setListening, listening
    } = useData()

    const handleSearch = (e) => {
        e.preventDefault()
        navigate('/search')
        setRender(!render)
    }

    const onMicClick = () => {
        setOpenSearchDialog(!openSearchDialog)
        setListening(!listening)
    }

    return (
        <AppBar sx={{ height: '64px' }} position='static' color='transparent' >
            <Toolbar>
                <Menu onClick={() => setOpenSideBar(!openSideBar)} sx={{ cursor: 'pointer' }} />
                <Heading onClick={() => navigate('/')} >
                    <Cloud fontSize='large' />
                    <Typography>MyCloud</Typography>
                </Heading>
                <SearchWrapper onSubmit={(e) => handleSearch(e)}>
                    <InputBase value={searchValue} onChange={(e) => setSearchValue(e.target.value)} required placeholder='Search' />
                    <button type='submit' style={{
                        border: 'none',
                        color: 'inherit',
                        background: 'inherit'
                    }} ><Search style={{ cursor: 'pointer' }} /></button>
                </SearchWrapper>
                <Mic onClick={() => onMicClick()} style={{ marginLeft: 10, cursor: 'pointer' }} color='' />
                <RightSection>
                    {
                        auth ? (
                            <>
                                <CloudUpload sx={{ marginRight: 5, marginBottom: '5px' }} onClick={() => navigate('/upload')} />
                                {
                                    auth?.user?.profile ?
                                        <img onClick={() => setOpenAccountInfoDialog(!openAccountInfoDialog)}
                                            style={{
                                                marginTop: 5,
                                                height: 40,
                                                width: 40,
                                                borderRadius: '50%',
                                                cursor: 'pointer'
                                            }} src={`/api/v1/auth/user-profile/${auth?.user?.profile}`} alt="profile" />
                                        :
                                        <img onClick={() => setOpenAccountInfoDialog(!openAccountInfoDialog)}
                                            style={{
                                                marginTop: 5,
                                                height: 40,
                                                width: 40,
                                                borderRadius: '50%',
                                                cursor: 'pointer'
                                            }} src="/images/account.jpg" alt="profile" />
                                }
                            </>
                        ) :
                            (
                                <Box onClick={() => setOpenLoginDialog(!openLoginDialog)} sx={{
                                    display: 'flex',
                                    border: '1px solid grey',
                                    padding: '5px 10px',
                                    borderRadius: 5,
                                    marginRight: 1,
                                    color: 'Highlight',
                                    cursor: 'pointer'
                                }}
                                    component='span'>
                                    <AccountCircleOutlined style={{ marginRight: 5 }} />
                                    <Typography>Sign in</Typography>
                                </Box>
                            )
                    }
                </RightSection>
            </Toolbar>
        </AppBar>
    )
}

export default Header
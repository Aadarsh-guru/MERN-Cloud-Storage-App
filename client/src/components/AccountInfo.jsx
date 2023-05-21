import { Dialog, Typography, styled, Box } from '@mui/material'
import { useData } from '../context/DataProvider'
import { BorderColor, Logout } from '@mui/icons-material'

const Image = styled('img')({
    width: 100,
    height: 100,
    borderRadius: '50%',
    margin: '0px auto',
    marginTop: '40px',
    marginBottom: 10
})

const Name = styled(Typography)({
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 600
})

const Email = styled(Typography)({
    fontSize: 16,
    padding: 10,
    fontWeight: 600,
    color: 'gray',
    textAlign: 'center'
})

const Joined = styled(Typography)({
    textAlign: 'center',
    padding: 5,
    fontWeight: 600,
    color: 'gray',
    fontSize: 14
})

const LogoutButton = styled(Box)({
    color: 'grey',
    textDecoration: "none",
    display: 'flex',
    padding: '10px 20px',
    margin: '0px auto',
    cursor: 'pointer',
    borderRadius: 10,
    fontSize: 16,
    '& > svg': {
        marginRight: 10,
        marginTop: 2
    },
    ':hover': {
        color: 'red',
        fontWeight: 600
    },
})

const EditButton = styled(Box)({
    color: 'grey',
    textDecoration: "none",
    display: 'flex',
    padding: '10px 20px',
    margin: '0px auto',
    cursor: 'pointer',
    borderRadius: 10,
    fontSize: 16,
    '& > svg': {
        marginRight: 10,
        marginTop: 2
    },
    ':hover': {
        color: '#000',
        fontWeight: 600
    },
})

const AccountInfo = () => {

    const {
        openAccountInfoDialog, setOpenAccountInfoDialog,
        setAuth, auth,
        openAccountEditDialog, setOpenAccountEditDialog
    } = useData()

    const handleLogout = () => {
        setAuth('')
        localStorage.removeItem('auth')
        setOpenAccountInfoDialog(!openAccountInfoDialog)
    }

    return (
        <Dialog open={openAccountInfoDialog}
            onClose={() => setOpenAccountInfoDialog(!openAccountInfoDialog)}
            hideBackdrop={true} sx={{
                "& .MuiDialog-container": {
                    "& .MuiPaper-root": {
                        width: "100%",
                        maxWidth: "20vw",
                        height: '100%',
                        maxHeight: '45vh',
                        marginLeft: 'auto',
                        marginBottom: 47,
                        borderRadius: 4,
                        marginRight: 2,
                        background: '#f2f2f2'
                    },
                },
            }} >
            {
                auth?.user?.profile ?
                    <Image src={`/api/v1/auth/user-profile/${auth?.user?.profile}`} alt="profile" />
                    :
                    <Image src='/images/account.jpg' />
            }
            {
                auth && <Name>{auth.user.firstName + ' ' + auth.user.lastName}</Name>
            }
            {
                auth && <Email>{auth.user.email}</Email>
            }
            {
                auth && <Joined>Joined {new Date(auth.user?.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</Joined>
            }
            {
                auth && <EditButton
                    onClick={() => {
                        setOpenAccountEditDialog(!openAccountEditDialog);
                        setOpenAccountInfoDialog(!openAccountInfoDialog)
                    }} >
                    <BorderColor />
                    <Typography>Edit Profile</Typography>
                </EditButton>
            }
            {
                auth && <LogoutButton onClick={() => handleLogout()} >
                    <Logout />
                    <Typography>Sign Out</Typography>
                </LogoutButton>
            }
        </Dialog>
    )
}

export default AccountInfo
import { Box, Button, Dialog, TextField, Typography, styled } from "@mui/material"
import { AddAPhoto } from '@mui/icons-material'
import { useData } from "../context/DataProvider"
import { useState } from "react"
import toast from 'react-hot-toast'
import axios from "axios"

const SignInWrapper = styled(Box)({
    width: '100%',
    height: '100%',
    display: 'flex'
})

const SignUpWrapper = styled(Box)({
    width: '100%',
    height: '100%',
    display: 'flex',
    background: '#f2f2f2'
})

const Image = styled('img')({
    height: 200,
    width: 200,
    marginTop: 50,
    borderRadius: '50%'
})

const RightBox = styled(Box)({
    width: '50vw',
    height: '100vh',
})

const LeftBox = styled(Box)({
    width: '50vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: '1px solid lightgrey'
})

const Text = styled(Typography)({
    padding: '5px 20px',
    fontSize: 14,
    color: 'Highlight',
    '& > svg': {
        margin: '0 0 0 5px'
    },
    ':hover': {
        color: 'grey'
    },
    cursor: 'pointer'
})

const Info = styled(Typography)({
    color: 'grey',
    fontSize: 14,
    textAlign: 'center',
    padding: '20px'
})

const StyledButoon = styled(Button)({
    fontSize: 16,
    margin: '30px auto',
    textTransform: 'capitalize',
    color: 'GrayText'
})

const Heading = styled(Typography)({
    margin: 20,
    textAlign: 'center',
    fontSize: '1.8rem',
    color: 'Highlight'
})

const Form = styled('form')({
    margin: '20px 20px',
    '& > div': {
        width: '100%',
        marginTop: 25
    }
})

const SubmitButton = styled(Button)({
    width: '100%',
    marginTop: 30
})

const Error = styled(Typography)({
    fontSize: 10,
    color: 'red',
    fontWeight: 600,
    margin: '2px 0 0 0'
})

const LoginLeftBox = styled(Box)({
    width: '50vw',
    height: '100vh',
    backgroundImage: 'url(/images/login-image.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: '#ffffff',
    textAlign: 'center'
})

const LoginRightBox = styled(Box)({
    width: '50vw',
    height: '100vh',
    background: '#f2f2f2',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > div': {
        background: '#ffffff',
        width: '80%',
        margin: '100px 0 0 0',
        borderRadius: 25,
        boxShadow: '1px 1px grey',
        textAlign: 'center',
        '& > p': {
            margin: '20px 0 0 0'
        },
    },
})


const Login = () => {

    const [toggleForm, setToggleForm] = useState('sign-in')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [profile, setProfile] = useState('')
    const [loading, setLoading] = useState(false)

    const { setAuth, openLoginDialog, setOpenLoginDialog } = useData()

    const handleSignUp = async (e) => {
        e.preventDefault()
        try {
            if (profile) {
                if (!profile?.type.includes('image')) {
                    return toast.error('Profile should be an image.')
                }
                if (profile?.size > 1000000) {
                    return toast.error('Profile image size must be 1MB.')
                }
            }
            if (password !== confirmPassword) {
                return toast.error('Password and confirm password is not matching.')
            }
            if (password?.length < 6) {
                return toast.error('Password Must Be 6 Characters Long.')
            }
            const formData = new FormData()
            formData.append('firstName', firstName)
            formData.append('lastName', lastName)
            formData.append('email', email)
            formData.append('password', password)
            profile && formData.append('profile', profile)
            setLoading(true)
            const response = await axios.post('/api/v1/auth/register', formData)
            response && setLoading(false)
            response && toast.success(response.data.message)
            if (response.status === 201) {
                setToggleForm('sign-in')
            }
        } catch (error) {
            console.log(error);
            toast.error('Something Went Wrong')
            setLoading(false)
        }
    }

    const handleSignIn = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const response = await axios.post('/api/v1/auth/login', { email, password })
            response && setLoading(false)
            if (response.data.success) {
                setAuth(response.data)
                localStorage.setItem('auth', JSON.stringify(response.data))
                toast.success(response.data.message)
                setOpenLoginDialog(!openLoginDialog)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error('Something Went Wrong')
            setLoading(false)
        }
    }

    return (
        <Dialog open={openLoginDialog} onClose={() => setOpenLoginDialog(!openLoginDialog)} hideBackdrop={true} sx={{
            "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                    width: "100%",
                    maxWidth: "70vw",
                    height: '100%',
                    maxHeight: '70vh'
                },
            },
        }} >
            {
                toggleForm === 'sign-in' ?
                    <SignInWrapper>
                        <LoginLeftBox>
                            <Typography variant="h2" style={{ margin: '200px 0 20px 0' }} >Welcome Back</Typography>
                            <Typography variant="h5" style={{}} >We would be glad to serve you again.</Typography>
                        </LoginLeftBox>
                        <LoginRightBox>
                            <Box>
                                <Heading>Sign In</Heading>
                                <Form onSubmit={(e) => handleSignIn(e)} >
                                    < TextField type="email" variant="standard" label='Email' required onChange={(e) => setEmail(e.target.value)} />
                                    < TextField type="password" variant="standard" label='Password' required onChange={(e) => setPassword(e.target.value)} />
                                    <SubmitButton disabled={loading && true} variant="contained" type="submit" >{loading ? 'Signing in...' : 'Sign in'}</SubmitButton>
                                </Form>
                                <StyledButoon style={{ margin: '10px auto' }} onClick={() => setToggleForm('sign-up')} >
                                    Don't! have An Account? then <Box component='span' style={{ color: 'Highlight', marginLeft: 10 }} >Sign Up</Box>
                                </StyledButoon>
                            </Box>
                        </LoginRightBox>
                    </SignInWrapper>
                    :
                    <SignUpWrapper>
                        <LeftBox>
                            <label htmlFor="profile">
                                <Image src={profile ? URL.createObjectURL(profile) : "/images/account.jpg"} alt="" />
                                <Text>Add Profile Picture <AddAPhoto fontSize="small" /> </Text>
                                {profile?.size > 1000000 && <Error>Profile size should be less than 1 MB.</Error>}
                                {profile && !profile?.type.includes('image') && <Error>Only Image Flies .jpg, .jpeg, .png are accepted</Error>}
                            </label>
                            <Info>
                                " Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque voluptate quaerat dolore possimus? Exercitationem non, neque, officia quaerat tenetur nostrum repellendus eum dolores possimus ipsam reprehenderit fugiat maiores at vel sit similique molestiae vero distinctio quod autem, ea mollitia debitis. Nihil fugiat earum doloribus vero quia aspernatur veniam culpa est. "
                            </Info>
                            <StyledButoon onClick={() => setToggleForm('sign-in')} >
                                Already! have An Account? then <Box component='span' style={{ color: 'Highlight', marginLeft: 10 }} >Sign In</Box>
                            </StyledButoon>
                        </LeftBox>
                        <RightBox>
                            <Heading>Sign Up Form</Heading>
                            <Form onSubmit={(e) => handleSignUp(e)} >
                                < TextField type="text" variant="standard" label='Fisrt name' required onChange={(e) => setFirstName(e.target.value)} />
                                {firstName && firstName?.length < 3 && <Error>First name must contains 3 charecters</Error>}
                                < TextField type="text" variant="standard" label='Last name' required onChange={(e) => setLastName(e.target.value)} />
                                {lastName && lastName?.length < 3 && <Error>Last name must contains 3 charecters</Error>}
                                < TextField type="email" variant="standard" label='Email' required onChange={(e) => setEmail(e.target.value)} />
                                < TextField type="password" variant="standard" label='Password' required onChange={(e) => setPassword(e.target.value)} />
                                {password && password?.length < 6 && <Error>Password must be 6 charecters long.</Error>}
                                < TextField type="password" variant="standard" label='Confirm Password' required onChange={(e) => setConfirmPassword(e.target.value)} />
                                {confirmPassword && confirmPassword !== password && <Error>Password is not matching.</Error>}
                                < TextField type="file" style={{ display: 'none' }} id="profile" onChange={(e) => setProfile(e.target.files[0])} />
                                <SubmitButton disabled={loading && true} variant="contained" type="submit" >{loading ? 'Signing up...' : 'Sign Up'}</SubmitButton>
                            </Form>
                        </RightBox>
                    </SignUpWrapper>
            }
        </Dialog>
    )
}

export default Login

import { Box, Button, Dialog, TextField, Typography, styled } from "@mui/material"
import { AddAPhoto } from '@mui/icons-material'
import { useData } from "../context/DataProvider"
import { useEffect, useState } from "react"
import toast from 'react-hot-toast'
import axios from "axios"


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
        margin: '0 0 5px 0'
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
    margin: '15px auto 0 auto',
    textTransform: 'capitalize',
    color: 'GrayText',
    ':hover': {
        color: 'red',
        fontWeight: 600
    }
})

const CancelButton = styled(Button)({
    fontSize: 16,
    margin: '20px auto',
    textTransform: 'capitalize',
    color: 'GrayText',
    ':hover': {
        color: '#000',
        fontWeight: 600
    }
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


const AccountEditDialog = () => {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [profile, setProfile] = useState('')
    const [loading, setLoading] = useState(false)

    const { setAuth, auth, openAccountEditDialog, setOpenAccountEditDialog, render, setRender } = useData()

    const handleUpdatep = async (e) => {
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
            if (confirmPassword) {
                if (confirmPassword?.length < 6) {
                    return toast.error('New Password Must Be 6 Characters Long.')
                }
            }
            const formData = new FormData()
            formData.append('firstName', firstName)
            formData.append('lastName', lastName)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('newPassword', confirmPassword)
            profile && formData.append('profile', profile)
            setLoading(true)
            const response = await axios.put('/api/v1/auth/update', formData)
            response && setLoading(false)
            if (response.status === 201) {
                setOpenAccountEditDialog(!openAccountEditDialog)
                setAuth('')
                localStorage.removeItem('auth')
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error('Something Went Wrong')
            setLoading(false)
        }
    }

    useEffect(() => {
        setFirstName(auth?.user?.firstName)
        setLastName(auth?.user?.lastName)
        setEmail(auth?.user?.email)
        // eslint-disable-next-line
    }, [openAccountEditDialog])


    const handleDelete = async () => {
        try {
            if (!password) {
                return toast.error('Current password is reqired.')
            }
            if (window.confirm('Are You Sure You want to Delete Your Account?')) {
                const response = await axios.post(`/api/v1/auth/delete-user`, { email, password })
                if (response.status === 202) {
                    toast.success(response.data.message)
                    setOpenAccountEditDialog(!openAccountEditDialog)
                    setRender(!render)
                    setAuth('')
                    localStorage.removeItem('auth')
                } else {
                    toast.error(response.data.message)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Dialog open={openAccountEditDialog} onClose={() => setOpenAccountEditDialog(!openAccountEditDialog)} hideBackdrop={true} sx={{
            "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                    width: "100%",
                    maxWidth: "70vw",
                    height: '100%',
                    maxHeight: '70vh'
                },
            },
        }} >
            <SignUpWrapper>
                <LeftBox>
                    <label htmlFor="profile">
                        {profile ? <Image src={profile && URL.createObjectURL(profile)} alt="" /> : <Image src={auth?.user?.profile ? `/api/v1/auth/user-profile/${auth?.user?.profile}` : "/images/account.jpg"} alt="" />}
                        <Text>Add Profile Picture <AddAPhoto fontSize="small" /> </Text>
                        {profile?.size > 1000000 && <Error>Profile size should be less than 1 MB.</Error>}
                        {profile && !profile?.type.includes('image') && <Error>Only Image Flies .jpg, .jpeg, .png are accepted</Error>}
                    </label>
                    <Info>
                        "Note - After Successfull Update You'll be loged out. and you'll have to login again with updated details, to see all changes. in case you want to delete your account Permanantly then Current password is required. and All the Data Related to your account will be deleted."
                    </Info>
                    <StyledButoon onClick={() => handleDelete()} >
                        Delete Account Permanantly.
                    </StyledButoon>
                    <CancelButton onClick={() => setOpenAccountEditDialog(!openAccountEditDialog)} >
                        Cancel Changes
                    </CancelButton>
                </LeftBox>
                <RightBox>
                    <Heading>Update Profile</Heading>
                    <Form onSubmit={(e) => handleUpdatep(e)} >
                        < TextField type="text" value={firstName} variant="standard" label='Fisrt name' required onChange={(e) => setFirstName(e.target.value)} />
                        {firstName && firstName?.length < 3 && <Error>First name must contains 3 charecters</Error>}
                        < TextField type="text" value={lastName} variant="standard" label='Last name' required onChange={(e) => setLastName(e.target.value)} />
                        {lastName && lastName?.length < 3 && <Error>Last name must contains 3 charecters</Error>}
                        < TextField type="email" disabled value={email} variant="standard" label='Email' required onChange={(e) => setEmail(e.target.value)} />
                        < TextField type="password" variant="standard" label='Enter Current Password' required onChange={(e) => setPassword(e.target.value)} />
                        < TextField type="password" variant="standard" label='Enter New Password' onChange={(e) => setConfirmPassword(e.target.value)} />
                        {confirmPassword && confirmPassword.length < 6 && <Error>Password must be 6 charecters long.</Error>}
                        < TextField type="file" style={{ display: 'none' }} id="profile" onChange={(e) => setProfile(e.target.files[0])} />
                        <SubmitButton disabled={loading && true} variant="contained" type="submit" >{loading ? 'Updating..' : 'Update'}</SubmitButton>
                    </Form>
                </RightBox>
            </SignUpWrapper>
        </Dialog>
    )
}

export default AccountEditDialog

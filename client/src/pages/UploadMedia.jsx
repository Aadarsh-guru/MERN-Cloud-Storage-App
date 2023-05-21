import axios from 'axios'
import Layout from '../layout/Layout'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Typography, styled } from '@mui/material'
import { useData } from '../context/DataProvider'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Upload } from '@mui/icons-material'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


const Wrapper = styled(Box)({
    height: '100vh',
    width: '100%',
    background: 'lightgray',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
})

const UploadButton = styled(Box)({
    color: 'gray',
    textAlign: 'center',
    border: '2px dashed grey',
    borderRadius: "50%",
    height: 150,
    width: 150,
    padding: '15px 30px',
    cursor: 'pointer',
    ':hover': {
        color: 'black',
        border: '3px dashed black',
    }
})

const Content = styled(Box)({
    '& > p': {
        padding: '10px 0',
        width: '100%'
    },
    "& > div": {
        padding: '10px 0 ',
        width: '100%'
    }
})

const UploadMedia = () => {

    const { render, setRender } = useData()
    const [keywords, setkeywords] = useState('')
    const [files, setFiles] = useState('')
    const [visibility, setVisibility] = useState('')
    const [loading, setLoading] = useState(false)
    const [uploded, setUploded] = useState(0)
    const [open, setOpen] = useState(false)

    const navigate = useNavigate()

    const hanldeUpload = async (e) => {
        e.preventDefault()
        setOpen(!open)
        try {
            const formData = new FormData()
            formData.append('files', files)
            formData.append('keywords', keywords)
            formData.append('visible', visibility)
            setLoading(true)
            const response = await axios.post('/api/v1/media/upload', formData, {
                onUploadProgress: (data) => {
                    setUploded(Math.round(data.progress * 100))
                }
            })
            response && setLoading(false)
            if (response.status === 201) {
                toast.success(response.data.message)
                files && files?.type.includes('image') ? navigate('/your-images') : files?.type.includes('video') ? navigate('/your-videos') : navigate('/your-docs')
                setRender(!render)
                setFiles('')
                setkeywords('')
                setVisibility('')
                setUploded('')
            } else {
                toast.error(response.data.message)
                setFiles('')
                setkeywords('')
                setVisibility('')
                setUploded('')
            }
        } catch (error) {
            console.log(error);
            setLoading(false)
            setUploded('')
            toast.error('something went wrong.')
        }
    }

    useEffect(() => {
        if (files) {
            setOpen(!open)
        }
        // eslint-disable-next-line
    }, [files])

    return (
        <Layout title='Upload Page - MyCloud' >
            <Wrapper>
                <label htmlFor="file">
                    <UploadButton >
                        {
                            uploded ?
                                (
                                    <>
                                        {uploded && <Typography style={{ fontSize: 28, margin: '25px 0 0 0px' }} >{uploded}%</Typography>}
                                        {loading && <Typography>uploading</Typography>}
                                    </>
                                )
                                :
                                (
                                    <>
                                        <Upload style={{ fontSize: 75 }} />
                                        <Typography>Select File</Typography>
                                    </>
                                )
                        }
                    </UploadButton>
                    <input type="file" onChange={(e) => setFiles(e.target.files[0])} id="file" style={{ display: 'none' }} />
                </label>
                <Dialog open={open}
                    hideBackdrop={true} sx={{
                        "& .MuiDialog-container": {
                            "& .MuiPaper-root": {
                                width: "100%",
                                maxWidth: "40vw",
                                height: '100%',
                                maxHeight: '45vh',
                            },
                        },
                    }}
                >
                    <form onSubmit={(e) => hanldeUpload(e)} >
                        <DialogTitle>Upload</DialogTitle>
                        <DialogContent>
                            <Content>
                                {
                                    files && <Typography>File Name - {files?.name}</Typography>
                                }
                                {
                                    files && <Typography>File Size - {Math.round(files?.size / 1048576) + 'MB'}</Typography>
                                }
                                <TextField onChange={(e) => setkeywords(e.target.value)} required label="Enter Keywords" variant='standard' />
                                <TextField onChange={(e) => setVisibility(e.target.value)} value={visibility} required label='Visibility' variant='standard' select >
                                    <MenuItem value="private">Private</MenuItem>
                                    <MenuItem value='public'>Public</MenuItem>
                                </TextField>
                            </Content>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(!open)}>Cancel</Button>
                            <Button type='submit'>Upload</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Wrapper >
        </Layout >
    )
}

export default UploadMedia

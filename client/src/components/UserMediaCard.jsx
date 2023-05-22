import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, TextField, styled } from '@mui/material'
import { Close, Delete, Download, Edit, Share, Visibility } from '@mui/icons-material'
import { useEffect, useState } from "react"
import toast from 'react-hot-toast'
import axios from 'axios'
import { useData } from '../context/DataProvider'


const Card = styled(Box)({
    width: '30vw',
    height: '40vh',
    textDecoration: 'none',
    color: 'inherit',
    border: '1px solid gray',
    borderRadius: 20
})

const CardImage = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 20,
    cursor: 'pointer'
})
const Item = styled(MenuItem)({
    ':hover': {
        color: 'red'
    },
    '& > svg': {
        marginRight: 10
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

const HomeMediaCard = ({ file }) => {

    const { render, setRender } = useData()
    const [keywords, setkeywords] = useState('')
    const [visibility, setVisibility] = useState('')
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = async (file) => {
        try {
            if (window.confirm('Are you sure ?')) {
                const response = await axios.delete(`/api/v1/media/delete/${file._id}`)
                if (response.data.success) {
                    toast.success(`${file.contentType.includes('image') ? 'Image' : file.contentType.includes('video') ? 'Video' : 'Document'} Deleted Successfully`)
                    setRender(!render)
                } else {
                    toast.error(response.data.message)
                }
            }
        } catch (error) {
            console.log(error);
            toast.error('something went wrong')
        }
    }

    const handleEdit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`/api/v1/media/edit/${file?._id}`, { keywords, visibility })
            if (response.data.success) {
                toast.success(response.data.message)
                setOpenEditDialog(!openEditDialog)
            } else {
                toast.success(`${file.contentType.includes('image') ? 'Image' : file.contentType.includes('video') ? 'Video' : 'Document'} Details Updated Successfully`)
                setOpenEditDialog(!openEditDialog)
            }
        } catch (error) {
            console.log(error);
            toast.error('something went wrong')
        }
    }

    useEffect(() => {
        setVisibility(file?.visible)
        setkeywords(file?.keywords)
        // eslint-disable-next-line
    }, [openEditDialog])

    const handleDownloadFile = async () => {
        try {
            const response = await axios({
                url: `/api/v1/media/download/${file?.filename}`,
                method: "GET",
                responseType: 'blob'
            })
            const href = URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', `${file?.filename}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
            toast.success(`${file.contentType.includes('image') ? 'Image' : file.contentType.includes('video') ? 'Video' : 'Document'} Downloded Successfully`)
            handleMenuClose()
        } catch (error) {
            console.log(error);
            handleMenuClose()
            toast.success('something went wrong')
        }
    }

    const copyToClipboard = () => {
        window.navigator.clipboard.writeText(`${window.location.origin.includes('localhost:3000') ? `http://localhost:8000/api/v1/media/get/${file?.filename}` : `${window.location.origin}/api/v1/media/get/${file?.filename}`}`)
        handleMenuClose()
        toast.success('Copied to clipboard.')
    }

    return (
        <>
            <Card key={file?._id} >
                <CardImage onClick={handleMenuClick} src={file.contentType.includes('image') ? `/api/v1/media/get/${file?.filename}` : file.contentType.includes('video') ? '/images/video-file-image.png' : '/images/pdf-file-image.png'} alt="file" />
                <Box>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <Item onClick={() => { window.open(`${window.location.origin.includes('localhost:3000') ? `http://localhost:8000/api/v1/media/get/${file?.filename}` : `${window.location.origin}/api/v1/media/get/${file?.filename}`}`, '_blank'); handleMenuClose() }} ><Visibility /> {file.contentType.includes('image') ? `View` : file.contentType.includes('video') ? 'Watch Video' : 'Open'}</Item>
                        <Item onClick={() => handleDownloadFile()} ><Download /> Download</Item>
                        <Item onClick={() => copyToClipboard()} ><Share /> Copy Link</Item>
                        <Item onClick={() => handleDelete(file)} ><Delete /> Delete</Item>
                        <Item onClick={() => { setOpenEditDialog(!openEditDialog); handleMenuClose() }} ><Edit /> Edit</Item>
                        <Item onClick={handleMenuClose} ><Close />Close</Item>
                    </Menu>
                </Box>
            </Card>

            {/* Edit dialog */}
            <Dialog open={openEditDialog}
                hideBackdrop={true} sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "40vw",
                            height: '100%',
                            maxHeight: '35vh',
                        },
                    },
                }}
            >
                <form onSubmit={(e) => handleEdit(e)} >
                    <DialogTitle>Edit</DialogTitle>
                    <DialogContent>
                        <Content>
                            <TextField onChange={(e) => setkeywords(e.target.value)} value={keywords} required label="Enter Keywords" variant='standard' />
                            <TextField onChange={(e) => setVisibility(e.target.value)} value={visibility} required label='Visibility' variant='standard' select >
                                <MenuItem value="private">Private</MenuItem>
                                <MenuItem value='public'>Public</MenuItem>
                            </TextField>
                        </Content>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEditDialog(!openEditDialog)}>Cancel</Button>
                        <Button type='submit'>Edit</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export default HomeMediaCard

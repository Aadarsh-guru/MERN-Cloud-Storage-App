import { Box, Menu, MenuItem, styled } from '@mui/material'
import { Close, Download, Share, Visibility } from '@mui/icons-material'
import { useState } from "react"
import toast from 'react-hot-toast'
import axios from 'axios'

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

const HomeMediaCard = ({ file }) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };


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
                    <Item onClick={handleMenuClose} ><Close />Close</Item>
                </Menu>
            </Box>
        </Card>
    )
}

export default HomeMediaCard

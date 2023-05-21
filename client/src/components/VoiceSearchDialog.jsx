import { Box, Dialog, Typography, styled } from '@mui/material'
import React, { useEffect } from 'react'
import { useData } from '../context/DataProvider'
import { useNavigate } from 'react-router-dom'
import { Mic } from '@mui/icons-material'


const Container = styled(Box)({
    width: '100%',
    height: '100%',
})

const MicIcon = styled(Mic)({
    fontSize: 75,
    margin: '30px 0px 0px 105px'
})

const Text = styled(Typography)({
    fontSize: 20,
    margin: '10px 90px'
})

const VoiceSearchDialog = () => {

    const { searchValue, setSearchValue, openSearchDialog, setOpenSearchDialog, listening, setRender, render } = useData()
    const navigate = useNavigate()

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-GB"
    recognition.onresult = function (event) {
        setSearchValue(event.results[0][0].transcript)
    }
    useEffect(() => {
        if (listening && openSearchDialog) {
            recognition.start()
        }
        // eslint-disable-next-line
    }, [listening])

    useEffect(() => {
        if (searchValue) {
            if (openSearchDialog) {
                navigate('/search')
                setOpenSearchDialog(!openSearchDialog)
                setRender(!render)
            }
        }
        // eslint-disable-next-line
    }, [searchValue])


    return (
        <Dialog open={openSearchDialog} onClose={() => { setOpenSearchDialog(!openSearchDialog); recognition.stop() }} hideBackdrop={true} sx={{
            "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                    width: "100%",
                    maxWidth: "20vw",
                    height: '100%',
                    maxHeight: '20vh',
                    borderRadius: 5,
                    marginBottom: 70,
                    marginLeft: 70
                },
            },
        }} >
            <Container>
                <MicIcon />
                {
                    openSearchDialog && <Text>Listening...</Text>
                }
            </Container>
        </Dialog >
    )
}

export default VoiceSearchDialog
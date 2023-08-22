
import './Home.css'
import { NavigationBar } from '../../components/NavigationBar';
import { Outlet, useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Modal, OutlinedInput, Select, SelectChangeEvent, Fab } from '@mui/material';
import { AuthAxios } from '../../utils/AxiosConfig';
import { languageOptions } from '../../utils/Constants';
import { CustomTextField } from '../../components/CustomTextField';



export default function Home() {

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('');
    const [type, setType] = useState('private');
    const authAxios = AuthAxios();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const navigateToCodeEditor = (id: string) => {
        navigate(`/code-editor/${id}`);
    }


    const handleCreateCodeEditor = () => {

        const data = {
            title: title,
            description: description,
            language: language,
            isPrivate: type === 'private' ? true : false
        }

        authAxios.post("http://localhost:5000/api/v1/code-editor/create", data)
            .then((res) => {
                console.log(res.data);
                const codeEditorId = res.data.codeEditorId;
                navigateToCodeEditor(codeEditorId);
            })
            .catch((err) => {
                const errorMessage = (err && err.response) ? err.response.data : "Something went wrong";
                console.log(errorMessage);
            });
    }

    const handleLanguageChange = (event: SelectChangeEvent) => {
        setLanguage(event.target.value as string);
    };

    const handleTypeChange = (event: SelectChangeEvent) => {
        setType(event.target.value as string);
    };

    return (
        <div className='home-page'>
            <NavigationBar />
            {
                <Fab
                    color="secondary"
                    onClick={handleOpen}
                    variant="extended"
                    style={{ position: 'fixed', bottom: '40px', right: '40px'}}>
                    <AddCircleOutlineIcon sx={{ mr: 1 }}/>
                        Add
                </Fab>
            }
            <Outlet />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <div className='modal'>
                    <CustomTextField
                        id="title"
                        label="Title"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        size='small'
                        color='secondary'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <CustomTextField
                        id="description"
                        label="Description"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        size='small'
                        color='secondary'
                        value={description}
                        multiline
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <FormControl
                        fullWidth
                        size='small'
                        color='secondary'
                        sx={{ marginTop: '10px' }}>
                        <InputLabel id="language-label" color='secondary'>Language</InputLabel>
                        <Select
                            labelId="language-label"
                            id="language"
                            value={language}
                            color="secondary"
                            sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
                            onChange={handleLanguageChange}
                            input={
                                <OutlinedInput label="Language" color='secondary' />
                            }>
                            {
                                languageOptions.map((language) => {
                                    return <MenuItem key={language.id} value={language.value} color='secondary'>{language.label}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                    <FormControl
                        fullWidth
                        size='small'
                        color='secondary'
                        sx={{ marginTop: '20px' }}>
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select
                            labelId="type-label"
                            id="type"
                            value={type}
                            label="Type"
                            onChange={handleTypeChange}
                            defaultChecked={true}
                            defaultValue={'private'}
                            sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}>
                            <MenuItem value={'private'} color='secondary'>Private</MenuItem>
                            <MenuItem value={'public'} color='secondary'>Public</MenuItem>
                        </Select>
                    </FormControl>
                    <div className='modal-footer'>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleCreateCodeEditor}>
                            Create
                        </Button>
                    </div>
                </div>
            </Modal >
        </div>
    )
}

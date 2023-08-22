

import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material'
import React from 'react'
import { monacoThemes } from '../utils/Constants'

interface CodeEditorThemeChangeProps {
    theme: string,
    handelThemechange: (event: SelectChangeEvent) => void
}

export const CodeEditorThemeChange: React.FC<CodeEditorThemeChangeProps> = ({ theme, handelThemechange }) => {
    return (
        <div className="code-editor-settings">
            <FormControl color='secondary' size="small" fullWidth>
                <InputLabel id="theme-label" color='secondary'>Theme</InputLabel>
                <Select
                    labelId="theme-label"
                    id="theme"
                    fullWidth
                    value={theme}
                    color="secondary"
                    size="small"
                    sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
                    onChange={handelThemechange}
                    input={
                        <OutlinedInput label="Theme" color='secondary' />
                    }>
                    {
                        monacoThemes.map((theme) => {
                            return <MenuItem key={theme} value={theme} color='secondary'>{theme}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        </div>
    )
}

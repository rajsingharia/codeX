import { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, SelectChangeEvent } from '@mui/material'
import './CodeEditor.css'
import axios from "axios";
import MonacoEditor from '../../components/MonacoEditor'
import { AuthAxios } from "../../utils/AxiosConfig";
import CodeEditorModel from "../../models/CodeEditorModel";
import { CustomButton, CustomIconButton } from "../../components/CustomButtons";
import { useParams } from "react-router-dom";
import { defaultTheme } from "../../utils/Constants";
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

interface CodeEditorProps {
  isWatchMode: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ isWatchMode }) => {

  const [theme, setTheme] = useState<string>(defaultTheme);
  const [codeEditor, setCodeEditor] = useState<CodeEditorModel | undefined>();
  const [openShareCodeDialog, setOpenShareCodeDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { codeEditorId } = useParams();

  console.log(codeEditorId);

  useEffect(() => {
    const authAxios = AuthAxios();
    setLoading(true);
    authAxios.get(`http://localhost:5000/api/v1/code-editor/${codeEditorId}`)
      .then((res) => {
        console.log(res);
        setCodeEditor(res.data);
      })
      .catch((err) => {
        const errorMessage = (err && err.response) ? err.response.data : "Something went wrong";
        console.log(errorMessage);
      })
      .finally(() => {
        //setTimeout(() => {
        setLoading(false);
        //}, 1000);
      });
  }, [codeEditorId])

  const handleCodeChange = (value: string) => {
    setCodeEditor((prevState) => {
      if (prevState) {
        return { ...prevState, code: value }
      }
    })
  };

  const saveCodeToServer = () => {

    const body = {
      code: codeEditor?.code
    }

    axios.put(`http://localhost:5000/api/v1/code-editor/${codeEditorId}`, body, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        const errorMessage = (err && err.response) ? err.response.data : "Something went wrong";
        console.log(errorMessage);
      });
  }

  const handleThemeChange = (event: SelectChangeEvent) => {
    setTheme(event.target.value as string);
  }

  const showShareCodeDialog = () => {
    setOpenShareCodeDialog(true);
  }

  return (
    <div className='page'>
      {
        loading ?
          <div className='loading'>
            <CircularProgress color='secondary' />
          </div>
          :
          <div className='page-content'>
            <div className="code-editor-header">
              <h4 style={{ width: '100%', marginLeft: '10px' }}>{codeEditor?.language.toUpperCase()}</h4>
              <h4 style={{ width: '100%', marginLeft: '10px', fontFamily: 'Courier New, monospace', letterSpacing: '2px', fontSize: '1.2rem' }}>{codeEditor?.title}</h4>
              {
                !isWatchMode &&
                <CustomButton
                  variant="outlined"
                  onClick={saveCodeToServer}>
                  Save
                </CustomButton>
              }
              {
                !isWatchMode && codeEditor && codeEditor?.isLive &&
                <CustomIconButton onClick={showShareCodeDialog}>
                  <ShareOutlinedIcon />
                </CustomIconButton>
              }
            </div>
            <div className="code-editor">
              <MonacoEditor
                isWatchMode={isWatchMode}
                codeEditor={codeEditor}
                onCodeChange={handleCodeChange}
                theme={theme}
                handelThemechange={handleThemeChange}
              />
            </div>
            <Dialog
              open={openShareCodeDialog}
              onClose={() => setOpenShareCodeDialog(false)}>
              <DialogTitle style={{ backgroundColor: 'black', color: 'white' }}>
                {"Share Code"}
              </DialogTitle >
              <DialogContent style={{ backgroundColor: 'black', color: 'white' }}>
                <DialogContentText style={{ backgroundColor: 'black', color: 'white' }}>
                  {
                    "Share this link with your friends to share your code:"
                  }
                </DialogContentText>
                <DialogContentText style={{ backgroundColor: 'black', color: 'white', wordWrap: 'break-word', marginTop: '10px' }}>
                  {
                    `http://localhost:5173/code-editor/share/${codeEditorId}`
                  }
                </DialogContentText>
              </DialogContent>
              <DialogActions style={{ backgroundColor: 'black', color: 'white' }}>
                <CustomButton onClick={() => setOpenShareCodeDialog(false)}>Close</CustomButton>
              </DialogActions>
            </Dialog>
          </div>
      }
    </div>
  )
}

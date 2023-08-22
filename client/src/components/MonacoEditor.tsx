import { Editor } from '@monaco-editor/react';
import { TextField, SelectChangeEvent, Alert, Snackbar, AlertColor, Tooltip } from '@mui/material';
import { CustomLoadingButton } from './CustomButtons';
import OutputWindow from './Outputwindow';

import axios, { AxiosError } from 'axios';
import { useState, useEffect, useRef } from 'react';
import { languageOptions } from '../utils/Constants';
import { AuthAxios } from '../utils/AxiosConfig';
import CodeEditorModel from '../models/CodeEditorModel';
import { getSocket } from '../WebSocket';
import { editor, IRange } from 'monaco-editor';
import { CodeEditorThemeChange } from './CodeEditorThemeChange';

interface CodeEditorProps {
  isWatchMode: boolean;
  codeEditor: CodeEditorModel | undefined;
  theme: string;
  onCodeChange: (newCode: string) => void;
  handelThemechange: (event: SelectChangeEvent) => void;
}

interface ConnectSocketBody {
  // userId?: string,
  roomId?: string
}

interface ResponseMessage {
  severity: AlertColor;
  message: string;
}

interface CodeChanges {
  type: string;
  range: IRange;
  text: string;
}

type OutputDetails = {
  compile_output: string;
  status: {
    id: number;
  };
  stdout: string;
  stderr: string;
};

const MonacoEditor: React.FC<CodeEditorProps> = ({ isWatchMode, theme, codeEditor, onCodeChange, handelThemechange }) => {

  const [customInput, setCustomInput] = useState<string>('');
  const [output, setOutput] = useState<OutputDetails | undefined>(undefined);
  const [processing, setProcessing] = useState<boolean>(false);
  const [liveProcessing, setLiveProcessing] = useState<boolean>(false);
  const [unLiveProcessing, setUnLiveProcessing] = useState<boolean>(false);
  const [openSnackbar, setOpenSnakbar] = useState<boolean>(false);
  const [message, setMessage] = useState<ResponseMessage>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const authAxios = AuthAxios();
  const fromApiRef = useRef<boolean>(false);

  const socket = getSocket();
  
  const RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY;

  const showSnackBar = (visible: boolean, message: ResponseMessage | undefined = undefined) => {
    showSnackBar(visible);
    setMessage(message);
  }

  const emitChangesIfLive = (event: editor.IModelContentChangedEvent, fromApi: boolean) => {
    if (codeEditor?.isLive) {
      fromApiRef.current = fromApi;
      if (fromApi) return;

      const changes: CodeChanges = {
        type: event.changes[0].text ? "insert" : "delete",
        range: event.changes[0].range,
        text: event.changes[0].text,
      };
      console.log('change', changes);
      socket.emit('send-code-changes', { delta: changes, roomId: codeEditor?._id });
    }
  }

  const connectToSocketAndJoinRoom = () => {

    socket.connect();

    const body: ConnectSocketBody = {
      // userId: currentUserId,
      roomId: codeEditor?._id
    };
    socket.emit('join-room', body);

    socket.on('connect', () => {
      console.log('socket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected');
      setIsConnected(false);
    });
  }

  const receiveCodeChanges = () => {
    socket.on('receive-code-changes', (codeChanges: CodeChanges) => {
      if (!editorRef.current) return;

      fromApiRef.current = true;

      // TODO: apply only changes to the editor without re-rendering the whole editor
      console.log('code changes receive ', codeChanges);
      console.log(editorRef.current);

      const type = codeChanges.type;
      const range = codeChanges.range;
      const text = codeChanges.text;

      if (type === "insert") {
        editorRef.current?.executeEdits(null, [
          {
            range: range,
            text: text,
            forceMoveMarkers: true
          },
        ]);
      } else {
        editorRef.current?.executeEdits(null, [
          {
            range: range,
            text: "",
            forceMoveMarkers: true
          },
        ]);
      }

      fromApiRef.current = false;

    });
  }

  // const sendCursorPositions = () => {
  //   if (!editorRef.current) return;

  //   editorRef.current.onDidChangeCursorPosition((event: editor.ICursorPositionChangedEvent) => {
  //     const position = event.position;
  //     console.log('cursor position changed', position);
  //     socket.emit('send-cursor-position', position, codeEditor?._id);
  //   });
  // }

  
  // const receiveCursorPositions = () => {
  //   if (!editorRef.current) return;
  //   const model = editorRef.current.getModel();
  //   if (!model) return;

  //   socket.on('receive-cursor-position', (position: Map<string, Position>) => {

  //     console.log('cursor position received', position);

  //     // remove all the cursors from the editor
  //     model.getAllDecorations().forEach((decoration) => {
  //       if (decoration.options.className === 'myCursor') {
  //         //decoration.options
  //       }
  //     });

  //     // add all the cursors from the editor
  //     Object.keys(position).forEach((participantId) => {
  //       const participantPosition = position.get(participantId);
  //       if (!participantPosition) return;
  //       model.deltaDecorations([], [
  //         {
  //           range: new Range(participantPosition.lineNumber, participantPosition.column, participantPosition.lineNumber, participantPosition.column),
  //           options: {
  //             className: 'myCursor',
  //             stickiness: 1,
  //             glyphMarginClassName: 'myCursor-glyph-margin',
  //             glyphMarginHoverMessage: {
  //               value: `Participant ${participantId} is here`,
  //             },
  //           },
  //         },
  //       ]);
  //     });
  //   });
  // }

  useEffect(() => {
    if (codeEditor?.isLive) {
      connectToSocketAndJoinRoom();
      receiveCodeChanges(); // in this room, get the codeChanges from other users
      //sendCursorPositions();
      //receiveCursorPositions(); // in this room, get the cursor position from other users
    }

    return () => {
      if (codeEditor?.isLive) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('receive-code-changes');
        socket.disconnect();
      }
    };

  }, [codeEditor?.isLive])


  const checkStatus = async (token: string) => {
    const options = {
      method: "GET",
      url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": 'judge0-ce.p.rapidapi.com',
        "X-RapidAPI-Key": RAPID_API_KEY,
      },
    };
    try {
      const response = await axios.request(options);
      const statusId = response.data.status?.id;

      // TODO: find a better way to handel this with threshold cound of request and then response with "server not responding"
      if (statusId === 1 || statusId === 2) {
        setTimeout(() => {
          checkStatus(token)
        }, 2000)
        return
      } else {
        setProcessing(false);
        setOutput(response.data);
        showSnackBar(true, { severity: "success", message: "Successfully Compiled" });
        console.log('status response ', response.data)
        return
      }
    } catch (err) {
      let errorMessage = "Something went wrong";
      if (err && err instanceof AxiosError) {
        errorMessage = err?.response?.data ?? "Something went wrong";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setProcessing(false);
      showSnackBar(true, { severity: "error", message: errorMessage });
    }
  };

  const handleCompile = () => {
    setProcessing(true);

    if (!codeEditor) return;

    const languageObj = languageOptions.find((lang) => lang.value === codeEditor.language);
    if (!languageObj) return;

    const formData = {
      language_id: languageObj.id,
      // encode source code in base64
      source_code: btoa(codeEditor?.code),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": 'judge0-ce.p.rapidapi.com',
        "X-RapidAPI-Key": RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("compile response ", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        const errorMessage = (err && err.response) ? err.response.data : "Something went wrong";
        setProcessing(false);
        showSnackBar(true, { severity: "error", message: errorMessage });
      });
  };

  const markAsLive = () => {

    setLiveProcessing(true);

    authAxios.post(`http://localhost:5000/api/v1/code-editor/changeLiveState/${codeEditor?._id}`, { isLive: true })
      .then((response) => {
        console.log(response.data)
        setLiveProcessing(false);
        showSnackBar(true, { severity: "success", message: "Successfully Marked as Live" });
      })
      .catch((err) => {
        const errorMessage = (err && err.response) ? err.response.data : "Something went wrong";
        setLiveProcessing(false);
        showSnackBar(true, { severity: "error", message: errorMessage });
      });
  }

  const unMarkAsLive = () => {
    setUnLiveProcessing(true);

    authAxios.post(`http://localhost:5000/api/v1/code-editor/changeLiveState/${codeEditor?._id}`, { isLive: false })
      .then((response) => {
        console.log(response.data)
        setUnLiveProcessing(false);
        showSnackBar(true, { severity: "success", message: "Successfully Marked as NotLive" });
      })
      .catch((err) => {
        const errorMessage = (err && err.response) ? err.response.data : "Something went wrong";
        console.log(errorMessage);
        setUnLiveProcessing(false);
        showSnackBar(true, { severity: "error", message: errorMessage });
      });
  }


  return (
    <div className='code-editor-body'>
      <div className="code-editor-code">
        <Editor
          height={'100%'}
          width={'100%'}
          theme={theme}
          language={codeEditor?.language}
          value={codeEditor?.code}
          onChange={
            (changes: string | undefined, event: editor.IModelContentChangedEvent) => {
              if (!changes) return;
              onCodeChange(changes);
              emitChangesIfLive(event, fromApiRef.current);
            }
          }
          options={{
            wordWrap: "on",
            minimap: { enabled: false },
            showUnused: false,
            folding: false,
            lineNumbersMinChars: 3,
            fontSize: 16,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
          onMount={(editor: editor.IStandaloneCodeEditor) => {
            console.log('editor mounted');
            editorRef.current = editor;
          }}
        />
      </div>
      <div className='code-editor-input-output'>
        {
          codeEditor?.isLive && isConnected &&
          <div className="code-editor-live-indicator">
            <Tooltip title="Live" arrow>
              <span className="connected-dot"></span>
            </Tooltip>
          </div>
        }
        {
          codeEditor?.isLive && !isConnected &&
          <div className="code-editor-live-indicator">
            <Tooltip title="Live" arrow>
              <span className="disconnected-dot"></span>
            </Tooltip>
          </div>
        }
        <CodeEditorThemeChange
          theme={theme}
          handelThemechange={handelThemechange} />
        <TextField
          id="input"
          label="Input"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          minRows={5}
          color='secondary'
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          sx={{ '& .MuiOutlinedInput-input': { color: 'white' }, '& .MuiInputLabel-root': { color: 'white' } }}
        />
        {
          output && 
          <div className='code-editor-output-card'>
            <OutputWindow
              outputDetails={output} />
          </div>
        }
        {
          codeEditor?.code && codeEditor?.code.length > 0 &&
          <CustomLoadingButton
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleCompile}
            loading={processing}
            sx={{ marginTop: '10px' }}>
            Compile
          </CustomLoadingButton>
        }
        {
          !isWatchMode && !codeEditor?.isLive &&
          <CustomLoadingButton
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ marginTop: '10px' }}
            loading={liveProcessing}
            onClick={markAsLive}>
            Go Live
          </CustomLoadingButton>
        }
        {
          !isWatchMode && codeEditor?.isLive &&
          <CustomLoadingButton
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ marginTop: '10px' }}
            loading={unLiveProcessing}
            onClick={unMarkAsLive}>
            Stop Live
          </CustomLoadingButton>
        }
        {
          <Snackbar
            open={openSnackbar}
            onClose={() => setOpenSnakbar(false)}
            autoHideDuration={6000}>
            <Alert severity={message?.severity ?? "info"} sx={{ width: '100%' }}>
              {message?.message}
            </Alert>
          </Snackbar>
        }
      </div>
    </div >
  );
};

export default MonacoEditor;
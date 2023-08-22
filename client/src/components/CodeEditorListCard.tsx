import { Grid } from "@mui/material";
import CodeEditorModel from "../models/CodeEditorModel";
import { convertDate } from "../utils/Helper";

interface CodeEditorListItemProps {
    codeEditor: CodeEditorModel,
    navigateToCodeEditor: (id: string) => void
}


const CodeEditorListCard: React.FC<CodeEditorListItemProps> = ({ codeEditor, navigateToCodeEditor }) => {

    const cropString = (text: string) => {
        if (text.length > 30) {
            return text.substring(0, 30) + "..."
        }
        return text;
    }

    return (
        <Grid item xs={2} >
            <div className='home-body-code-editor' onClick={() => navigateToCodeEditor(codeEditor?._id)}>
                <div className='home-body-code-editor-title'>
                    {codeEditor?.title}
                </div>
                <h4 className='home-body-code-editor-description'>
                    {cropString(codeEditor?.description)}
                </h4>
                <div className='home-body-code-editor-language'>
                    {codeEditor?.language}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className='home-body-code-editor-createdAt'>
                        {convertDate(codeEditor?.createdAt)}
                    </div>
                    {
                        <div className={ codeEditor?.isLive ? 'connected-dot' : 'disconnected-dot'}/>
                    }
                </div>
            </div>
        </Grid>
    )
}


export default CodeEditorListCard;

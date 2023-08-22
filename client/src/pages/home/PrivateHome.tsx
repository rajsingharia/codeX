
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Grid, Pagination, CircularProgress } from '@mui/material';
import './Home.css'
import { AuthAxios } from '../../utils/AxiosConfig';
import CodeEditorListCard from '../../components/CodeEditorListCard';
import CodeEditorModel from '../../models/CodeEditorModel';


export default function PrivateHome() {

    const navigate = useNavigate();
    const [userCodeEditorList, setUserCodeEditorList] = useState<CodeEditorModel[]>([] as CodeEditorModel[]);
    const authAxios = AuthAxios();
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>();

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true);
        authAxios.get(`http://localhost:5000/api/v1/code-editor/all?page=${page}&limit=${limit}`)
            .then((res) => {
                console.log(res.data);
                const listOfCodeEditor = res.data.page;
                setTotalPages(res.data.totalPages);
                // for testing adding same code editor 10 times
                // for (let i = 0; i < 14; i++) {
                //     listOfCodeEditor.push(listOfCodeEditor[0]);
                // }
                setUserCodeEditorList(listOfCodeEditor);
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
    }, [page]);


    const navigateToCodeEditor = (id: string) => {
        navigate(`/code-editor/${id}`);
    }



    return (
        <div className='home-page'>
            {
                loading ?
                    <div className='loading'>
                        <CircularProgress color='secondary' />
                    </div>
                    :
                    <div className='home-page-content'>

                        <div className='home-header'>
                        </div>
                        <div className='home-body'>
                            {
                                userCodeEditorList &&
                                <Grid container spacing={3}>
                                    {
                                        userCodeEditorList.map((codeEditor: CodeEditorModel) => {
                                            return (
                                                <CodeEditorListCard
                                                    key={codeEditor._id}
                                                    codeEditor={codeEditor}
                                                    navigateToCodeEditor={navigateToCodeEditor} />
                                            )
                                        })
                                    }
                                </Grid>
                            }
                        </div>
                        <div className='home-footer'>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_, value) => setPage(value)}
                                color="secondary"
                                size="small"
                                style={{ margin: '10px', backgroundColor: '#d998ffa2', padding: '5px 15px', borderRadius: '10px' }}
                            />
                        </div>
                    </div>
            }
        </div>
    )
}


type OutputDetails = {
  compile_output: string;
  status: {
    id: number;
  };
  stdout: string;
  stderr: string;
};


const OutputWindow = ({ outputDetails }: { outputDetails: OutputDetails }) => {
  const getOutput = () => {
    const statusId = outputDetails?.status?.id;

    if (statusId === 6) {
      // compilation error
      const compileOutput = window.atob(outputDetails?.compile_output);
      return (
        <pre style={{ padding: '0.25rem', fontWeight: 'normal', fontSize: '0.75rem', color: '#EF4444', wordWrap: "break-word" }}>
          {compileOutput}
        </pre>
      );
    } else if (statusId === 3) {
      const stdout = window.window.atob(outputDetails?.stdout);
      return (
        <pre style={{ padding: '0.25rem 0.5rem', fontWeight: 'normal', fontSize: '0.75rem', color: '#059669', wordWrap: "break-word" }}>
          {stdout !== null
            ? `${stdout}`
            : null}
        </pre>
      );
    } else if (statusId === 5) {
      return (
        <pre style={{ padding: '0.25rem', fontWeight: 'normal', fontSize: '0.75rem', color: '#EF4444', wordWrap: "break-word" }}>
          {`Time Limit Exceeded`}
        </pre>
      );
    } else {
      const stderr = window.atob(outputDetails?.stderr);
      return (
        <pre style={{ padding: '0.25rem', fontWeight: 'normal', fontSize: '0.75rem', color: '#EF4444', wordWrap: "break-word" }}>
          {stderr}
        </pre>
      );
    }
  };
  return (
    <>
      <div style={{ width: '100%', height: '14rem', backgroundColor: '#1e293b', borderRadius: '0.375rem', color: 'white', fontWeight: 'normal', fontSize: '0.875rem', overflowY: 'auto', wordWrap: "break-word" }}>
        {outputDetails ? <>{getOutput()}</> : null}
      </div>
    </>
  );
};

export default OutputWindow;
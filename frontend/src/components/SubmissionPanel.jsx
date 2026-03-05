function SubmissionPanel({ submission }) {
  if (!submission) {
    return <div className="mt-4">No submissions yet</div>;
  }

  return (
    <div className="border p-4 mt-4">
      <h2 className="font-bold mb-2">Submission Result</h2>

      <p>Status: {submission.status}</p>

      {submission.executionTime && (
        <p>Execution Time: {submission.executionTime}</p>
      )}

      {submission.memoryUsed && <p>Memory Used: {submission.memoryUsed}</p>}

      {submission.failedTestCase !== undefined && (
        <p>Failed Test Case: {submission.failedTestCase}</p>
      )}

      {submission.output && (
        <pre className="bg-gray-100 p-2 mt-2">{submission.output}</pre>
      )}
    </div>
  );
}

export default SubmissionPanel;

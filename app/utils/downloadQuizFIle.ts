export async function downloadQuizFile(quizId: string, format: 'pdf' | 'docx') {
  const response = await fetch(
    `http://localhost:3333/quiz/${quizId}/download?format=${format}`,
    {
      method: 'GET',
    }
  );

  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const shortId = quizId.slice(0, 8);
    a.href = url;
    a.download = `smartifyPDF_${shortId}.${format}`;
    a.click();
    window.URL.revokeObjectURL(url);
  } else {
    throw new Error('Download failed');
  }
}

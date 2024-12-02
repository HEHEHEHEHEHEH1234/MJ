import React, { useState } from 'react';
import { generateWorksheet, WorksheetContent } from '../../services/api';
import { Loader2, Download } from 'lucide-react';
import { ErrorMessage } from '../ErrorMessage';
import { jsPDF } from 'jspdf';

export const WorksheetGenerator: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [topic, setTopic] = useState('');
  const [worksheet, setWorksheet] = useState<WorksheetContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await generateWorksheet(subject, grade, topic);
      setWorksheet(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!worksheet) return;

    const doc = new jsPDF();
    const lineHeight = 10;
    let y = 20;

    // Title
    doc.setFontSize(20);
    doc.text(worksheet.title, 20, y);
    y += lineHeight * 2;

    // Instructions
    doc.setFontSize(12);
    doc.text(worksheet.instructions, 20, y);
    y += lineHeight * 2;

    // Questions and Answers
    worksheet.questions.forEach((q, i) => {
      doc.setFontSize(12);
      const questionText = `${i + 1}. ${q.question}`;
      doc.text(questionText, 20, y);
      y += lineHeight;

      doc.setTextColor(79, 70, 229); // Indigo color
      doc.text(`Answer: ${q.answer}`, 30, y);
      y += lineHeight * 1.5;
      doc.setTextColor(0);
    });

    // Save the PDF
    doc.save(`${worksheet.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Worksheet Generator</h2>
      
      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="input w-full"
            placeholder="e.g., 5th"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input w-full"
            placeholder="e.g., Mathematics"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="input w-full"
            placeholder="e.g., Fractions"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Generating...
            </>
          ) : (
            'Generate Worksheet'
          )}
        </button>
      </form>
      
      {worksheet && (
        <div className="mt-6">
          <button
            onClick={downloadPDF}
            className="btn btn-primary w-full flex items-center justify-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF Worksheet
          </button>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Preview:</h3>
            <div className="space-y-4">
              <h4 className="text-xl font-bold">{worksheet.title}</h4>
              <p className="text-gray-600">{worksheet.instructions}</p>
              {worksheet.questions.map((q, i) => (
                <div key={i} className="space-y-2">
                  <p className="font-medium">{`${i + 1}. ${q.question}`}</p>
                  <p className="text-indigo-600">Answer: {q.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
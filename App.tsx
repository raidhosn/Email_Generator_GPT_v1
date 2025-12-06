import React, { useState, useRef } from 'react';
import { ProcessingControls } from './components/ProcessingControls';
import { Button } from './components/Button';
import { processEmail } from './services/geminiService';
import { RefineMode } from './types';
import { ClipboardCopy, RotateCcw, Sparkles, Send, Trash2, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // We use a div for output now to support HTML tables
  const outputRef = useRef<HTMLDivElement>(null);

  const handleRefine = async (mode: RefineMode) => {
    if (!inputText.trim()) {
      setError("Please paste an email first.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setCopied(false);

    try {
      const result = await processEmail(inputText, mode);
      setOutputText(result);
      
      // Small delay to allow render before scroll
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!outputRef.current) return;

    try {
      const htmlContent = outputRef.current.innerHTML;
      const textContent = outputRef.current.innerText;

      // We need to create a ClipboardItem with both HTML and Plain Text
      // This ensures it pastes correctly in Word (HTML) and Notepad (Text)
      const blobHtml = new Blob([htmlContent], { type: 'text/html' });
      const blobText = new Blob([textContent], { type: 'text/plain' });
      
      const data = [new ClipboardItem({
        'text/html': blobHtml,
        'text/plain': blobText,
      })];

      await navigator.clipboard.write(data);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
      // Fallback for browsers that might have strict clipboard permissions
      try {
        await navigator.clipboard.writeText(outputRef.current.innerText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
         setError("Failed to copy to clipboard");
      }
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear both fields?")) {
      setInputText('');
      setOutputText('');
      setError(null);
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
              <Send className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">RefineMail</h1>
              <p className="text-sm text-gray-500">AI-powered email generator & refiner</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleClear} title="Clear all">
              <Trash2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" onClick={() => window.location.reload()} title="Reload App">
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="space-y-6">
          
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[300px] transition-shadow focus-within:shadow-md focus-within:ring-1 focus-within:ring-indigo-100">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Paste Original Email</label>
              <span className="text-xs text-gray-400">{inputText.length} chars</span>
            </div>
            <textarea
              className="flex-1 p-4 resize-none focus:outline-none text-base leading-relaxed text-gray-700 placeholder-gray-300 font-sans"
              placeholder="Paste your draft or data (e.g., 'ID: 123, Type: VM, Status: Active') here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          {/* Action Toolbar */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-3 text-sm font-medium text-gray-500 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                Select Processing Mode
              </span>
            </div>
          </div>

          <ProcessingControls onRefine={handleRefine} isLoading={isLoading} />

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-sm flex items-center gap-2 animate-fade-in">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {/* Output Section */}
          <div className={`bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden flex flex-col transition-all duration-500 ${outputText ? 'h-auto min-h-[400px] opacity-100' : 'h-0 opacity-0 overflow-hidden border-0'}`}>
            <div className="bg-indigo-50 px-4 py-2 border-b border-indigo-100 flex justify-between items-center">
              <label className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={12} />
                Final Email (Rich Text)
              </label>
              <Button variant="secondary" onClick={handleCopy} className="!py-1 !px-3 !text-xs gap-2">
                {copied ? <CheckCircle2 className="h-3 w-3 text-green-600" /> : <ClipboardCopy className="h-3 w-3" />}
                {copied ? 'Copied to Clipboard!' : 'Copy for Outlook'}
              </Button>
            </div>
            
            {/* Rich Text Display */}
            <div className="flex-1 relative bg-white p-6 overflow-auto">
              <div
                ref={outputRef}
                contentEditable
                suppressContentEditableWarning
                className="prose max-w-none focus:outline-none min-h-[300px] text-gray-800"
                style={{ fontFamily: 'Calibri, sans-serif, Inter' }}
                dangerouslySetInnerHTML={{ __html: outputText }}
              />
            </div>
          </div>

          {!outputText && !isLoading && (
             <div className="text-center py-10 opacity-40">
                <p className="text-sm text-gray-500">Select an action above to generate the result</p>
             </div>
          )}

        </main>
      </div>
    </div>
  );
}
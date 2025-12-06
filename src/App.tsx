import { useState, useRef } from 'react'
import './index.css'

function App() {
  const [inputEmail, setInputEmail] = useState('')
  const [outputHtml, setOutputHtml] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)

  // Helper to generate the table HTML. 
  // Accepts an optional 'context' string to modify content slightly for demo purposes, 
  // ensuring the table STRUCTURE remains 100% intact.
  const generateTableHtml = (context: string = '') => {
    // Mock data based on screenshot
    const headers = ['SUBSCRIPTION ID', 'REQUEST TYPE', 'VM TYPE', 'REGION', 'CORES', 'STATUS']
    const baseRowData = [
      ['689ebfb2-0f24-4c89-85dd-9f40f58c22a9', 'Region Enablement', 'Dlsv6 Series', 'Brazil South (SB)', '350', 'Approved'],
      ['689ebfb2-0f24-4c89-85dd-9f40f58c22a9', 'Region Enablement', 'Dadsv5 Series', 'Brazil South (SB)', '350', 'Approved'],
      ['689ebfb2-0f24-4c89-85dd-9f40f58c22a9', 'Region Enablement', 'Dadsv6 Series', 'Brazil South (SB)', '350', 'Approved'],
    ]

    // Apply context to show button reactivity without breaking structure
    const rowData = baseRowData.map(row => {
      if (context) {
        // Append context to the last cell or appropriate place to show change ONLY in content
        const newRow = [...row];
        newRow[5] = context; // Change 'STATUS' column for demo
        return newRow;
      }
      return row;
    });

    // Styles refined for "Desired Table" look
    // Header: Light Blue (#d9e1f2), Bold, Black Text.
    // Rows: "No background color (fully colorless)" -> transparent.
    // Text: White (to be visible on the dark background of the app/screenshot).
    // Font: Calibri Light, 11pt.
    // Alignment: Center.
    const tableStyle = 'border-collapse: collapse; font-family: "Calibri Light", "Calibri", sans-serif; font-size: 11pt; color: #ffffff;'
    const thStyle = 'border: 1px solid #bfbfbf; padding: 4px 12px; background-color: #d9e1f2; color: #000000; text-align: center; font-weight: bold; white-space: nowrap;'
    const tdStyle = 'border: 1px solid #bfbfbf; padding: 4px 12px; background-color: transparent; color: #ffffff; text-align: center; white-space: nowrap;'

    let html = `<table style="${tableStyle}"><thead><tr>`
    headers.forEach(h => html += `<th style="${thStyle}">${h}</th>`)
    html += `</tr></thead><tbody>`

    rowData.forEach(row => {
      html += `<tr>`
      row.forEach(cell => html += `<td style="${tdStyle}">${cell}</td>`)
      html += `</tr>`
    })
    html += `</tbody></table>`

    return html
  }

  const handleAction = (action: string) => {
    setIsLoading(true)
    setTimeout(() => {
      let result = ''
      // CRITICAL: ALL actions must return the TABLE to preserve structure.
      // We modify the content slightly to reflect the action.
      switch (action) {
        case 'en-proofread':
          result = generateTableHtml('Approved (EN)')
          break
        case 'pt-proofread':
          result = generateTableHtml('Aprovado (PT)')
          break
        case 'translator':
          result = generateTableHtml('Translated')
          break
        case 'case-title':
          result = generateTableHtml('Title Updated')
          break
        case 'case-notes':
          result = generateTableHtml('Notes Added')
          break
        case 'troubleshooting':
          result = generateTableHtml('Troubleshooted')
          break
        default:
          result = generateTableHtml('Approved')
      }
      setOutputHtml(result)
      setIsLoading(false)
    }, 800)
  }

  const copyToClipboard = async () => {
    if (!outputHtml) return
    try {
      const type = "text/html"
      const blob = new Blob([outputHtml], { type })
      const data = [new ClipboardItem({ [type]: blob })]
      await navigator.clipboard.write(data)
      alert("Copied to clipboard as HTML!")
    } catch (err) {
      console.error('Failed to copy: ', err)
      navigator.clipboard.writeText(outputRef.current?.innerText || '')
      alert("Copied as plain text (HTML copy failed check console).")
    }
  }

  return (
    <>
      <h1 className="title">Email Generator AI</h1>

      <div className="container">
        <div className="input-group">
          <label className="label">Paste Email Draft</label>
          <textarea
            className="textarea"
            placeholder="Paste your rough email text here..."
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
          />
        </div>

        <div className="actions">
          <button className="btn" onClick={() => handleAction('en-proofread')} disabled={isLoading}>
            <span className="btn-icon">📝</span>
            EN Proofread
          </button>
          <button className="btn" onClick={() => handleAction('pt-proofread')} disabled={isLoading}>
            <span className="btn-icon">🇧🇷</span>
            PT Proofread
          </button>
          <button className="btn" onClick={() => handleAction('translator')} disabled={isLoading}>
            <span className="btn-icon">🌐</span>
            EN ↔ PT Translator
          </button>
          <button className="btn" onClick={() => handleAction('case-title')} disabled={isLoading}>
            <span className="btn-icon">🏷️</span>
            Case Title
          </button>
          <button className="btn" onClick={() => handleAction('case-notes')} disabled={isLoading}>
            <span className="btn-icon">📋</span>
            Case Notes
          </button>
          <button className="btn" onClick={() => handleAction('troubleshooting')} disabled={isLoading}>
            <span className="btn-icon">🔧</span>
            Troubleshooting
          </button>
        </div>

        <div className="input-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="label">Generated Result (Preview)</label>
            <button className="copy-btn" onClick={copyToClipboard} disabled={!outputHtml}>
              Copy as HTML
            </button>
          </div>
          <div
            className="output-preview"
            ref={outputRef}
            dangerouslySetInnerHTML={{ __html: outputHtml || generateTableHtml() }} // Default to table if empty to show stability
          />
        </div>
      </div>
    </>
  )
}

export default App

# Email Generator AI (UI)

A lightweight single-page app for drafting and refining customer-facing support emails. The UI runs entirely in the browser using React and Tailwind from CDNs.

## Prerequisites
- Node.js 18+ (for the static server)

## Run locally
1. Install dependencies (none required).
2. Start the static server:
   ```bash
   npm start
   ```
3. Open the app in your browser at http://localhost:8000.

If you prefer to open the file directly without a server, you can load `index.html` in your browser, but some browsers block clipboard access in file mode—using the server is recommended.

## Notes
- The LLM call is mocked for demo purposes in `index.html` (`callYourLLM`). Replace it with your API when ready.
- Prompts and action buttons are all defined client-side in the same file for easy experimentation.

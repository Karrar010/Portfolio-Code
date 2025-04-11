// Code Editor Implementation
// This script creates an interactive code editor for the playground section

// Global variables
let editor;
let currentLanguage = 'javascript';

// Initialize code editor
function initCodeEditor() {
    const codeEditorArea = document.getElementById('code-editor-area');
    const runCodeBtn = document.getElementById('run-code');
    const codeOutput = document.getElementById('code-output');
    const languageSelect = document.getElementById('language-select');
    
    if (!codeEditorArea || !runCodeBtn || !codeOutput || !languageSelect) {
        console.log('Code editor elements not found');
        return;
    }
    
    // Initialize CodeMirror editor if available
    if (window.CodeMirror) {
        editor = CodeMirror(function(elt) {
            codeEditorArea.parentNode.replaceChild(elt, codeEditorArea);
        }, {
            value: '// Write your code here\n\nfunction greet() {\n  return "Hello, world!";\n}\n\ngreet();',
            mode: 'javascript',
            theme: 'monokai',
            lineNumbers: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            indentUnit: 2,
            tabSize: 2,
            indentWithTabs: false,
            lineWrapping: true
        });
    } else {
        // Fallback to basic textarea
        codeEditorArea.contentEditable = true;
        codeEditorArea.textContent = '// Write your code here\n\nfunction greet() {\n  return "Hello, world!";\n}\n\ngreet();';
    }
    
    // Set up language selection
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        
        if (editor) {
            editor.setOption('mode', currentLanguage);
        }
        
        // Update sample code based on language
        updateSampleCode(currentLanguage);
    });
    
    // Set up run code button
    runCodeBtn.addEventListener('click', () => {
        const code = editor ? editor.getValue() : codeEditorArea.textContent;
        executeCode(code, currentLanguage, codeOutput);
    });
}

// Update sample code based on selected language
function updateSampleCode(language) {
    let sampleCode = '';
    
    switch (language) {
        case 'javascript':
            sampleCode = '// Write your JavaScript code here\n\nfunction greet() {\n  return "Hello, world!";\n}\n\ngreet();';
            break;
        case 'html':
            sampleCode = '<!-- Write your HTML code here -->\n\n<div class="container">\n  <h1>Hello, world!</h1>\n  <p>This is a sample HTML code.</p>\n</div>';
            break;
        case 'css':
            sampleCode = '/* Write your CSS code here */\n\n.container {\n  max-width: 800px;\n  margin: 0 auto;\n  padding: 20px;\n}\n\nh1 {\n  color: #7b5cff;\n}';
            break;
        default:
            sampleCode = '// Write your code here';
    }
    
    if (editor) {
        editor.setValue(sampleCode);
    } else {
        document.getElementById('code-editor-area').textContent = sampleCode;
    }
}

// Execute code and display output
function executeCode(code, language, outputElement) {
    outputElement.innerHTML = '';
    
    try {
        switch (language) {
            case 'javascript':
                // Create a sandbox for JavaScript execution
                const sandbox = function(code) {
                    try {
                        // Use Function constructor to create a sandboxed function
                        const result = Function('"use strict";return (' + code + ')')();
                        return typeof result === 'object' ? 
                            JSON.stringify(result, null, 2) : String(result);
                    } catch (error) {
                        return 'Error: ' + error.message;
                    }
                };
                
                const result = sandbox(code);
                outputElement.textContent = result;
                break;
                
            case 'html':
                // Create iframe for HTML preview
                const iframe = document.createElement('iframe');
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                
                outputElement.appendChild(iframe);
                
                // Write HTML to iframe
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(code);
                iframeDoc.close();
                break;
                
            case 'css':
                // Create a preview for CSS
                const stylePreview = document.createElement('div');
                stylePreview.innerHTML = `
                    <div class="css-preview">
                        <h2>CSS Preview</h2>
                        <p>CSS code is applied to this preview container.</p>
                        <div class="container">
                            <h1>Sample Heading</h1>
                            <p>This is a paragraph inside the container.</p>
                        </div>
                    </div>
                `;
                
                // Create style element
                const style = document.createElement('style');
                style.textContent = code;
                
                stylePreview.appendChild(style);
                outputElement.appendChild(stylePreview);
                break;
                
            default:
                outputElement.textContent = 'Language not supported for execution.';
        }
    } catch (error) {
        outputElement.textContent = 'Error: ' + error.message;
    }
}

// Load CodeMirror if available
function loadCodeMirror() {
    // Check if CodeMirror is already loaded
    if (window.CodeMirror) {
        initCodeEditor();
        return;
    }
    
    // Load CodeMirror dynamically
    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };
    
    const loadCSS = (href) => {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    };
    
    // Load CodeMirror resources from CDN
    Promise.all([
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js'),
        loadCSS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css'),
        loadCSS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/monokai.min.css')
    ])
    .then(() => {
        // Load language modes
        return Promise.all([
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/javascript/javascript.min.js'),
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/htmlmixed/htmlmixed.min.js'),
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/css/css.min.js'),
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/xml/xml.min.js')
        ]);
    })
    .then(() => {
        // Load addons
        return Promise.all([
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/edit/closebrackets.min.js'),
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/edit/matchbrackets.min.js')
        ]);
    })
    .then(() => {
        // Initialize editor
        initCodeEditor();
    })
    .catch((error) => {
        console.error('Failed to load CodeMirror:', error);
        // Initialize with basic editor
        initCodeEditor();
    });
}

// Initialize when the DOM is loaded and when the playground tab is clicked
document.addEventListener('DOMContentLoaded', () => {
    // Use Intersection Observer to initialize when scrolled into view
    const playgroundSection = document.getElementById('playground');
    
    if (playgroundSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadCodeMirror();
                    observer.disconnect(); // Only initialize once
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(playgroundSection);
    }
    
    // Also initialize when the code editor tab is clicked
    const codeEditorTab = document.querySelector('.tab-btn[data-tab="code-editor"]');
    
    if (codeEditorTab) {
        codeEditorTab.addEventListener('click', loadCodeMirror);
    }
});

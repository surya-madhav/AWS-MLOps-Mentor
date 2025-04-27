interface PyodideInstance {
  setStdout(options: { batched: (output: string) => void }): void;
  loadPackagesFromImports(code: string, options: { messageCallback: (message: string) => void }): Promise<void>;
  runPythonAsync(code: string): Promise<any>;
}

type PyodideLoader = (options: { indexURL: string }) => Promise<PyodideInstance>;

declare global {
  interface Window {
    loadPyodide: PyodideLoader;
  }
  
  var loadPyodide: PyodideLoader;
}

export {};
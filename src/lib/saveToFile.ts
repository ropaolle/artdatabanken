export const saveToFile = async (file: Blob, suggestedName: string, types: FilePickerAcceptType[] = []) => {
  const supportsFileSystemAccess =
    'showSaveFilePicker' in window &&
    (() => {
      try {
        return window.self === window.top;
      } catch {
        return false;
      }
    })();

  if (supportsFileSystemAccess) {
    try {
      const handle = await showSaveFilePicker({ suggestedName, types });
      const writable = await handle.createWritable();
      await writable.write(file);
      await writable.close();
      return Promise.resolve(handle.name);
    } catch (error) {
      if (error instanceof DOMException && error.stack === 'Error: The user aborted a request.') {
        return Promise.reject('ABORTED');
      }
      return Promise.reject(error);
    }
  }

  // Fallback if the File System Access API is not supported.
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = suggestedName;
  link.click();
  URL.revokeObjectURL(link.href);
  return Promise.resolve(suggestedName);
};

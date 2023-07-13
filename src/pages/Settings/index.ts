import Settings from './Settings';

export enum ImportStates {
  'IDLE',
  'UPLOADING',
  'DONE',
}

export const readUploadedFileAsText = (file: File): Promise<string> => {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onerror = () => {
      fileReader.abort();
      reject(new DOMException('Problem parsing input file.'));
    };

    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };
    fileReader.readAsText(file);
  });
};

export default Settings;

async function createOrUpdateDoc(docRef: DocumentReference, data: ImageInfo | SpeciesInfo, update = false) {
  update ? setDoc(docRef, data) : updateDoc(docRef, data);
}

const checkIfFileExists = async (filePath: string): Promise<string | boolean> => {
  const storage = getStorage();
  const storageRef = ref(storage, filePath);

  return new Promise((resolve, reject) => {
    getDownloadURL(storageRef)
      .then((url) => {
        resolve(true);
      })
      .catch((error) => {
        if (error.code === 'storage/object-not-found') {
          resolve(false);
        } else {
          reject(error);
        }
      });
  });
};

const getFileList = (filePath: string): Promise<string[]> => {
  const listRef = ref(storage, filePath);

  return listAll(listRef)
    .then((res) => {
      return Promise.resolve(res.items.map(({ name }) => name));
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

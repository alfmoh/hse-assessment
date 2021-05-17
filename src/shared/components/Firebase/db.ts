import firebase from "./firebase";

const firestore = firebase.firestore();

const updateDb = (collectionPath: string, docPath: string, data: any) => {
  return firestore.collection(collectionPath).doc(docPath).update(data);
};

const createDb = (collectionPath: string, docPath: string, data: any) => {
  return firestore
    .collection(collectionPath)
    .doc(docPath)
    .set(data, { merge: true });
};

const createDbAutoId = (collectionPath: string, data: any) => {
  return firestore.collection(collectionPath).add(data);
};

const getDocs = (
  collectionPath: string,
  docIds: string[] | string
): Promise<any[]> => {
  const ids = Array.isArray(docIds) ? docIds : [docIds];
  if (ids[0]) {
    const refs = ids.map((id) =>
      firestore.collection(collectionPath).doc(id).get()
    );
    return Promise.all(refs).then((data) =>
      data.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }))
    );
  }
  return new Promise((resolve) => {
    resolve([]);
  });
};

const deleteDocument = (collectionPath: string, docId: string) => {
  return firestore.collection(collectionPath).doc(docId).delete();
};

const updateDocField = (collectionPath: string, docId: string, data: any) => {
  return firestore.collection(collectionPath).doc(docId).update(data);
};

const getAllDocs = async (collectionPath) => {
  const snapshot = await firebase.firestore().collection(collectionPath).get()
    return snapshot.docs.map(doc => doc.data());
}

export {
  updateDb,
  createDb,
  createDbAutoId,
  getDocs,
  deleteDocument,
  updateDocField,
  getAllDocs
};

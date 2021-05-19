import { firestore } from "../firebase";

const db = firestore.collection("/quests");

const getAll = () => {
  return db;
};

const create = (data) => {
  return db.add(data);
};

const update = (id, value) => {
  return db.doc(id).update(value);
};

const remove = (id) => {
  return db.doc(id).delete();
};

const QuestService = {
  getAll,
  create,
  update,
  remove
};

export default QuestService;

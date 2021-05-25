import { firestore } from "../firebase";

const db = firestore.collection("/quests");

const getAll = () => {
  return db;
};

const create = (data) => {
  return db.add(data);
};

const update = (id, quest) => {
  const newQuest = { ...quest };
  return db.doc(id).update(newQuest);
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

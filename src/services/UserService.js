import { firestore } from "../firebase";

const db = firestore.collection("/users");

const get = (uid) => {
  return db.doc(uid).get();
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

const UserService = {
  get,
  create,
  update,
  remove
};

export default UserService;

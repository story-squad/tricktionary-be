import db from "../../dbConfig";

const findAll = async () => {
  return await db('profiles');
};

const findBy = (filter:string) => {
  return db('profiles').where(filter);
};

const findById = async (id:string) => {
  return db('profiles').where({ id }).first().select('*');
};

const create = async (profile:object) => {
  return db('profiles').insert(profile).returning('*');
};

const update = (id:string, profile:object) => {
  return db('profiles')
    .where({ id: id })
    .first()
    .update(profile)
    .returning('*');
};

const remove = async (id:string) => {
  return await db('profiles').where({ id }).del();
};

const findOrCreateProfile = async (profileObj:{id: string}) => {
  const foundProfile = await findById(profileObj.id).then((profile) => profile);
  if (foundProfile) {
    return foundProfile;
  } else {
    return await create(profileObj).then((newProfile) => {
      return newProfile ? newProfile[0] : newProfile;
    });
  }
};

export default {
  findAll,
  findBy,
  findById,
  create,
  update,
  remove,
  findOrCreateProfile,
};
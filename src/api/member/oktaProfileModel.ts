import db from "../../dbConfig";

const findAll = async () => {
  return await db('profiles');
};

const findBy = (filter:any) => {
  return db('profiles').where(filter);
};

const findById = async (id:any) => {
  return db('profiles').where({ id }).first().select('*');
};

const create = async (profile:any) => {
  return db('profiles').insert(profile).returning('*');
};

const update = (id:any, profile:any) => {
  console.log(profile);
  return db('profiles')
    .where({ id: id })
    .first()
    .update(profile)
    .returning('*');
};

const remove = async (id:any) => {
  return await db('profiles').where({ id }).del();
};

const findOrCreateProfile = async (profileObj:any) => {
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
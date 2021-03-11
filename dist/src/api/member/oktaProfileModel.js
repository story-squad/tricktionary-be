"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = __importDefault(require("../../dbConfig"));
const findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield dbConfig_1.default('profiles');
});
const findBy = (filter) => {
    return dbConfig_1.default('profiles').where(filter);
};
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return dbConfig_1.default('profiles').where({ id }).first().select('*');
});
const create = (profile) => __awaiter(void 0, void 0, void 0, function* () {
    return dbConfig_1.default('profiles').insert(profile).returning('*');
});
const update = (id, profile) => {
    console.log(profile);
    return dbConfig_1.default('profiles')
        .where({ id: id })
        .first()
        .update(profile)
        .returning('*');
};
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield dbConfig_1.default('profiles').where({ id }).del();
});
const findOrCreateProfile = (profileObj) => __awaiter(void 0, void 0, void 0, function* () {
    const foundProfile = yield findById(profileObj.id).then((profile) => profile);
    if (foundProfile) {
        return foundProfile;
    }
    else {
        return yield create(profileObj).then((newProfile) => {
            return newProfile ? newProfile[0] : newProfile;
        });
    }
});
exports.default = {
    findAll,
    findBy,
    findById,
    create,
    update,
    remove,
    findOrCreateProfile,
};
//# sourceMappingURL=oktaProfileModel.js.map
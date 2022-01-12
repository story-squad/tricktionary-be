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
const http_errors_1 = __importDefault(require("http-errors"));
const jwt_verifier_1 = __importDefault(require("@okta/jwt-verifier"));
const oktaConfig_1 = __importDefault(require("./oktaConfig"));
const oktaProfileModel_1 = __importDefault(require("../member/oktaProfileModel"));
const oktaJwtVerifier = new jwt_verifier_1.default(oktaConfig_1.default.config);
const makeProfileObj = (claims) => {
    return {
        id: claims.sub,
        email: claims.email,
        name: claims.name,
    };
};
/**
 * A simple middleware that asserts valid Okta idToken and sends 401 responses
 * if the token is not present or fails validation. If the token is valid its
 * contents are attached to req.profile
 */
const authRequired = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization || '';
        const match = authHeader.match(/Bearer (.+)/);
        if (!match)
            throw new Error('Missing idToken');
        const idToken = match[1];
        oktaJwtVerifier
            .verifyAccessToken(idToken, oktaConfig_1.default.expectedAudience)
            .then((data) => __awaiter(void 0, void 0, void 0, function* () {
            const jwtUserObj = makeProfileObj(data.claims);
            const profile = yield oktaProfileModel_1.default.findOrCreateProfile(jwtUserObj);
            if (profile) {
                req.profile = profile;
            }
            else {
                throw new Error('Unable to process idToken');
            }
            next();
        }))
            .catch((err) => {
            console.error(err.message);
            next((0, http_errors_1.default)(401), err.message);
        });
    }
    catch (err) {
        next((0, http_errors_1.default)(401, err.message));
    }
});
exports.default = authRequired;
//# sourceMappingURL=oktaRequired.js.map
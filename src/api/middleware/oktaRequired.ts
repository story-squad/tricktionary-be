import createError from "http-errors";
import OktaJwtVerifier from "@okta/jwt-verifier";
import oktaVerifierConfig from "./oktaConfig";
import Profiles from "../member/oktaProfileModel";

const oktaJwtVerifier = new OktaJwtVerifier(oktaVerifierConfig.config);

const makeProfileObj = (claims: any) => {
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
const authRequired = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization || "";
    const match = authHeader.match(/Bearer (.+)/);

    if (!match) throw new Error("Missing idToken");

    const idToken = match[1];
    oktaJwtVerifier
      .verifyAccessToken(idToken, oktaVerifierConfig.expectedAudience)
      .then(async (data: any) => {
        const jwtUserObj = makeProfileObj(data.claims);
        const profile = await Profiles.findOrCreateProfile(jwtUserObj);
        if (profile) {
          req.profile = profile;
        } else {
          throw new Error("Unable to process idToken");
        }
        next();
      })
      .catch((err: any) => {
        console.error(err.message);
        next(createError(401), err.message);
      });
  } catch (err:any) {
    next(createError(401, err.message));
  }
};

export default authRequired;

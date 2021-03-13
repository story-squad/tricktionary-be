import fs from 'fs';
import path from 'path';

const paths:string[] = [process.env.LOGFOLDER || ".", process.env.LOGFILE || "tricktionary.log"];
const LOGFILE = path.resolve(path.join(...paths));
console.log('logging to ', LOGFILE)

/**
 * write to log file.
 * 
 * @param entry message
 */
export const log = function(entry:string) {
  fs.appendFileSync(LOGFILE, `${new Date().toISOString()} - ${entry}\n`);
};

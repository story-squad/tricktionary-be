import fs from 'fs';

export const log = function(entry:string) {
  fs.appendFileSync('/tmp/trixie.log', `${new Date().toISOString()} - ${entry}\n`);
};

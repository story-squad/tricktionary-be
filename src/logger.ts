import fs from 'fs';

const log = function(entry:string) {
  fs.appendFileSync('/tmp/trixie.log', `${new Date().toISOString()} - ${entry}\n`);
};


export { log }

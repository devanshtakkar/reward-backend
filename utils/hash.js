import {createHash} from 'crypto'

async function hashPassword(password){
	let hashObject = createHash('sha256');
	hashObject.update(password);
	let hash = hashObject.digest('base64');
	return hash
}

export {hashPassword}
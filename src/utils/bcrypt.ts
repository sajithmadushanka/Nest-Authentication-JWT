import * as bcrypt from 'bcrypt';


export async function hashData(password: string):Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function compareHash(passwrd:string, hashPassword:string):Promise<boolean>{
    return await bcrypt.compare(passwrd, hashPassword);
}
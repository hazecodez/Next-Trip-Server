import bcrypt from "bcrypt";

class Bcrypt {
  async Bcryption(password: string) {
    try {
      let hashed = bcrypt.hash(password, 10);
      return hashed;
    } catch (error) {
      console.log("Couldn't hash the password : ", error);
    }
  }
  async Encryption(password: string, hashPass: string) {
    try {
      let verifiedPass = bcrypt.compare(password, hashPass);
      return verifiedPass;
    } catch (error) {
      console.log("Couldn't compare the hashed password : ", error);
    }
  }
}

export default Bcrypt;

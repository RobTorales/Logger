import UserManager from "../dao/UserManager.js";
import { userModel } from "../dao/models/user.model.js";
import jwt from "jsonwebtoken";
const PRIVATE_KEY = "S3CR3T0";

class AuthServices {
    constructor(){
        this.UserManager = new UserManager();
        this.SecretKey = PRIVATE_KEY;
    }

    async LoginUser(email, password) {
        const user = await this.UserManager.login(email, password);
        if (!user) {
          return null;
        }
    
        let token = jwt.sign({ email, password, role: user.role }, PRIVATE_KEY, { expiresIn: "24h" });
    
        return { user, token };
      }
    

      async githubCallback(profile) {
        try{
            if(!profile || !profile._json){
                throw new Error("profile information is complete")
            }

            if (!profile._json.email) {
                console.warn('Email is null. Handling this case specifically.');
                profile._json.email = 'no-email@example.com';
            }

            let user = await userModel.findOne({ email: profile._json.email });
  
      if (!user) {
        user = await userModel.create({
          first_name: profile._json.name || 'Unknown',
          last_name: '',
          email: profile._json.email,
          age: 100,  
          password: '',  
          role: 'user',
        });
      }
  
        return user;
        } catch (error) {
            console.error('An error occurred:', error);
            throw error;
        }
    }
}


export default AuthServices;
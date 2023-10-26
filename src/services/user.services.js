import UserManager from "../dao/UserManager.js";

class UserServices{
    constructor(){
        this.UserManager = new UserManager();
    }

    async register ({ first_name, last_name, email, age, password, role }) {
        try {
          const user = await this.userManager.addUser({
            first_name,
            last_name,
            email,
            age,
            password,
            role,
          });
    
          if (user) {
            return { status: "success", user, redirect: "/login" }; 
          } else {
            return { status: "error", message: "User already exists" };
          }
        } catch (error) {
          console.error("Error registering user:", error);
          return { status: "error", message: "Internal Server Error" };
        }
      }

      async restorePassword (user, hashedPassword) {
        return await this.userManager.restorePassword(user, hashedPassword);
      }
}

export default UserServices;
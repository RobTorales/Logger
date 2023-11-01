import UserServices from "../services/user.services.js";
import CustomeError from "../services/error/customeError.js";
import EErrors from "../services/error/errorsEnum.js";

class UserController{
    constructor(){
        this.UserServices = new UserServices();
    }

    async register(req, res, next) {
        try {
          const { first_name, last_name, email, age, password, role } = req.body;
        if( !first_name || !email || !age || !password){
          const customeError = new CustomeError({
            name: "User creation error",
            cause: generateUserError({
              first_name, last_name, email, age, password,
            }),
            message: "Error al intentar registrar al usuario",
            code:400,
          });
          return next(customeError);
        }
        const response = await this.userService.register({
          first_name,
          last_name,
          email,
          age,
          password,
          role,
        });
    
        return res.status(response.status === "success" ? 200 : 400).json({
          status: response.status,
          data: response.user,
          redirect: response.redirect,
        });
        } catch (error) {
          return next(error);
        }
        
      }

      async restorePassword(req, res, next) {
    
        try {
          const { user, pass } = req.query;
          const passwordRestored = await this.userService.restorePassword(user, createHash(pass));
          if (passwordRestored) {
            return res.send({status: "OK", message: "La contraseña se ha actualizado correctamente"});
          } else {
            const customeError = new CustomeError({
              name: "Restore Error",
              massage: "No fue posible actualizar la contraseña",
              code: EErrors.PASSWORD_RESTORATION_ERROR,
            });
            return next(customeError);  
          }
        } catch (error) {
          req.logger.error(error);
          return next(error);
        }
      }
    

      current(req, res, next) {
        if (req.session.user) {
          return res.send({
            status: "OK",
            payload: new UserResponse(req.session.user),
          });
        } else {
          const customeError = new CustomeError({
            name: "Auth Error",
            massage: "No fue posible acceder a Current",
            code: EErrors.AUTHORIZATION_ERROR,
          });
          return next(customeError);  
        }
      }
    }

export default UserController;
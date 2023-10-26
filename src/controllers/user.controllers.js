import UserServices from "../services/user.services.js";

class UserController{
    constructor(){
        this.UserServices = new UserServices();
    }

    Register = async (req, res) => {
        return res.redirect("/login");
    }

    restorePassword = async (req, res) => {
        let {user, pass} = req.query;
        pass = createHash(pass);
        const passwordRestored = await UM.restorePassword(user, pass);
    
        if (passwordRestored) {
            res.send({status:"ok", message:"La contraseña se ha actualizado correctamente!"});
        } else {
            res.status(401).send({status:"error", message:"No se pudo actualizar la contraseña!"});
        }    
    }

    current = async (req, res) => {
        res.send({status:"OK", payload:req.user});
    }
}

export default UserController;
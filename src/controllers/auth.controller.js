import AuthServices from "../services/auth.services.js";
import CartServices from "../services/cart.services.js";
import { authError } from "../services/error/errorMessages/user.auth.error.js";
import CustomeError from "../services/error/customeError.js";

class AuthController {
    constructor (){
        this.AuthServices = new AuthServices();
        this.CartServices = new CartServices();
    }

    loginUser = async (req, res, next) => {
        const { email, password } = req.body;
        let user = await this.AuthServices.LoginUser(email, password);
        req.logger.info("User data retrieved:", userData);

        if (!user) {
            req.logger.error("Invalid credentials");
            const customeError = new CustomeError({
                name: "Auth Error",
                message: "Credenciales invalidas",
                code:401,
                cause: authError(email),
            });
            return next(customeError)
        }
        const userData = { token: Math.random().toString(36).substring(7) }; 
        res.cookie("robCookieToken", userData.token, { maxAge: 3600 * 1000, httpOnly: true });
        this.CartServices.newCart();    
        return res.status(200).json({ status: "success", user: userData.user, redirect: "/products" });
    }

    logOut = async (req, res) => {
        req.session.destroy;
        res.redirect("/");
    }

    githubCallback = async (req, res) => {
        req.session.user = req.user;
        req.session.loggedIn = true;
        res.redirect("/products");
    }

}

export default AuthController;
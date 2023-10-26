import passport from "passport";
import GitHubStrategy from "passport-github2";
import userModel from "../dao/models/user.model.js"
import { CLIENT_ID_GITHUB, CLIENT_SECRET_GITHUB } from "../config/config.js";
import AuthServices from "../services/auth.services.js";

const initializeGitHubPassport = () => {
    
    passport.use("github", new GitHubStrategy({
        clientID:"Iv1.909d0c87b6ba6ced",
        clientSecret:"7770b6ee54f047fd5213cbc4c2b92328362dea50",
        callbackURL:"http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const authService = new AuthServices();
            console.log(profile);
            const user = await authService.githubCallback(profile);

            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch(error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });
};

export default initializeGitHubPassport;



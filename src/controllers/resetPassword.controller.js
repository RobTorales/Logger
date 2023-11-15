import nodemailer from "nodemailer";
import crypto from "crypto";
import { userModel } from "../dao/models/user.model.js";
import { GMAIL_USER, GMAIL_PASS} from "../config/config.js";

const resetPasswordEmail = async (userEmail) => {
    const user = await userModel.findOne({email: userEmail})
    if(!user){
        throw new Error("Usuario no encontrado");
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    let transporter = nodemailer.createTransport({
        servide:"gmail",
        auth:{
            user:GMAIL_USER,
            pass: GMAIL_PASS,
        }
    });

    const resetUrl = `http://localhost:8080/reset-password/${resetToken}`;
    let emailOptions = {
        from: "roberto1608torales@gmail.com",
        to: userEmail,
        subject: "Link de restablecimiento de contraseña Burger Factory",
        text:`Por favor, para restablecer tu contraseña haz clic en el siguiente enlace: ${resetUrl}`,
        html:`<p>Por favor, para reestablecer tu contraseña haz click en el siguiente enlace:<a href="${resetUrl}">restablecer contraseña</a></p>`
    };
    await transporter.sendEmail(emailOptions)
};

export default resetPasswordEmail;
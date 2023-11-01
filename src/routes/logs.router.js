import { Router } from "express";

const logsRouter = new Router();

logsRouter.get("/", (req, res) =>{
    req.logger.fatal("Error critico");
    req.logger.error("Error de alto nivel");
    req.logger.warn("Mensaje de advertencia");
    req.logger.info(`Este es un log de informacion.`);
    req.logger.http("Http log");
    req.logger.debug("Este es un log de informacion de developer");
    res.send({message:"Test de logger"})

});

export default logsRouter;
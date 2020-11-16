import {Request,Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import generator from 'generate-password';
import { OAuth2Client } from 'google-auth-library';
import { SEED, CADUCIDAD_TOKEN, CLIENT_ID } from "../global/environment";
import modelusuario from '../models/user';
const client = new OAuth2Client( CLIENT_ID ); 

export default class UserController{

    static login(req:Request,res:Response){
        let body = req.body;
        modelusuario.findOne({"email":body.email}).exec((err:any,usuarioDB:any)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        message:"Error",
                        err
                    });
                }
                if(!usuarioDB){
                    return res.status(401).json({
                        ok:false,
                        message:"No se encuentra el usuario"
                    });
                }

                if(!bcrypt.compareSync(body.pass,usuarioDB.pass)){
                    return res.status(400).json({
                        ok:false,
                        message:"Error contraseña incorrectas"
                    });
                }

                let token = jwt.sign({
                    id: usuarioDB.id,
                    email: usuarioDB.email,
                    nombre: usuarioDB.nombre,
                    apellido: usuarioDB.apellido
                }
                    ,SEED , { expiresIn: CADUCIDAD_TOKEN });

                usuarioDB.pass = ":D";   
                return res.status(200).json({
                    ok: true,
                    usuarioDB,
                    token
                });              
        });


    }
    static async loginGoogle(req:Request,res:Response){
        let body = req.body;
        let token = body.token;
        let GoogleUser = await UserController.verifyGoogle(token);

        if(!GoogleUser.payload.email_verified){
            return res.status(403).json({
                ok:false,
                message:'Error email no verificado use otro email'
            });
        }
        let email = GoogleUser.payload.email;
        let userData = GoogleUser.payload;
        modelusuario.findOne({"email":email})
            .exec((err:any,usuarioDB:any)=>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: "Error",
                        err
                    });
                }
                if (!usuarioDB) {
                    let userpass = "=)";
                    let pass = bcrypt.hashSync(userpass, 10);
                    let Newusuario = new modelusuario({
                        nombre: userData.given_name,
                        apellido: userData.family_name,
                        role: 2,
                        username: `${userData.given_name}${userData.family_name}`,                     
                        biografia: "",
                        email: userData.email,
                        imagen:userData.picture,
                        pass: pass
                    });

                    Newusuario.save((err:any, usuarioDB:any) => {
                        if (err) {
                              return res.status(400).json({
                                ok:false,
                                message:'Error',
                                err
                            })
                        }
            
                        if (!usuarioDB){
                            return res.status(400).json({
                                ok:false,
                                message:'Error'
                            })
                        }                                          
                        if(usuarioDB){
                            UserController.generarToken(usuarioDB,res);
                        }                          
                    });
                }
                if(usuarioDB){
                    UserController.generarToken(usuarioDB,res);
                }   
            });

    }
    static async verifyGoogle(token:any){
        let ticket = await client.verifyIdToken({
            idToken:token,
            audience:CLIENT_ID
        });

        let payload:any = ticket.getPayload();
        let userid = payload['sub'];

        return {
            payload
        }
    }
    static generarToken(usuarioDB:any,res:Response){
        let token = jwt.sign({
            id: usuarioDB._id,
            email: usuarioDB.email,
            nombre: usuarioDB.nombre,
            apellido: usuarioDB.apellido
        }
            , SEED, { expiresIn: CADUCIDAD_TOKEN });
        usuarioDB.pass = ":D";
        return res.status(200).json({
            ok: true,
            usuarioDB,
            token
        });
    }
    static crearUsuario(req:Request,res:Response){
        let body = req.body;
        let pass = bcrypt.hashSync(body.pass,10);

        let usuario = new modelusuario({
            nombre: body.nombre,
            apellido: body.apellido,
            role: 1,
            username: `${body.nombre}${body.apellido}`,
            telefono: "",
            biografia: "",
            email: body.email,
            pass: pass
        });

        usuario.save((err:any, usuarioDB:any) => {
            if (err) {
                console.log(err)
            }

            if (!usuarioDB){
                return res.status(401).json({
                    ok:false,
                    message:"Error "
                })
            }               

            return res.status(200).json({
                ok: true
            });
        });
    }
    static check(req:Request,res:Response){
        let email = req.params.id;

        modelusuario.findOne({"email":email}).exec((err:any,email:any)=>{
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: "Error",
                    err
                });
            }
            if (!email) {
                return res.status(200).json({
                    email: true
                });
            }
            return res.status(200).json({
                email: false
            });
        });
    }
    static editarUsuario(req:Request,res:Response){
        let body = req.body;

        modelusuario.updateOne(
            { _id: body.id },
            {
                $set: {
                    nombre: body.nombre,
                    apellido: body.apellido,
                    username: body.username,                 
                    email: body.email
                }
            },
            (err:any, usuarioDB:any) => {
                if (err)
                    return res.status(500).json({
                        ok: false,
                        message: " Error al actualizar el producto."
                    });
                if (!usuarioDB)
                    return res.status(404).json({
                        ok: false,
                        message: "No se pudo actualizar"
                    });
                usuarioDB.pass = ":D";
                return res.status(200).json({
                    ok: true,
                    usuarioDB
                });
            });
    }
    static getUser(req:Request,res:Response){
        let id = req.params.id;
        modelusuario.findById(id, { pass: false }, (error:any, usuario:any) => {
            if (error) {
                res.status(500).json({
                    ok: false,
                    error
                });
            }
            if (!usuario) {
                res.status(400).json({
                    ok: false,
                    message: "No se encuentra usuario"
                });
            }

            if (usuario) {
                return res.status(200).json({
                    ok: true,
                    usuario
                });
            }
        });
    }
    static checkpass(req:Request,res:Response){
        let body = req.body;

        modelusuario
        .findOne({ "_id": body._id })
        .exec((err:any, usuarioDB:any) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: "Error",
                    err
                });
            }
            if (!usuarioDB) {
                return res.status(401).json({
                    ok: false,
                    message: "No se encuentra el Usuario"
                });
            }

            if (!bcrypt.compareSync(body.pass, usuarioDB.pass)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Error Contraseña incorrectas'
                    }
                });
            }
            usuarioDB.pass = ":D";

            if (usuarioDB) {
                UserController.changepass(req,res);
                // UserController.changepass(req, res);
            }

        });

    }
    static changepass(req:Request,res:Response){
        let body = req.body;
        let pass = bcrypt.hashSync(body.pass,10);

        modelusuario
        .findOneAndUpdate({ "_id": body._id }, { "pass": pass })
        .exec((err:any, usuarioDB:any) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: "Error",
                    err
                });
            }
            if (!usuarioDB) {
                return res.status(401).json({
                    ok: false,
                    message: "No se encuentra el Usuario"
                });
            }

            if (usuarioDB) {
                return res.status(200).json({
                    ok: true,
                    message: "Ha Actualizado su Contraseña"
                });
            }
        })
    }
    static recovery(req:Request,res:Response){

    }  
}
var modelpregunta = require('../models/preguntas');
import {Request,Response } from "express";

export default class PreguntasController{

    static preguntar(req:Request,res:Response){

        let  body:any = req.body;       

        var pregunta = modelpregunta({
            miembros: [body.usuario],
            categoria:body.categoria,
            mensajes: [{
                from: body.usuario,
                body: body.body
            }],
            activo:true

        });

        modelpregunta.findOne({ "miembros": body.usuario }, (error:any, chat:any) => {
            if (error) {
                return res.status(500).json({
                    ok:false,
                    error                    
                })
            }
            if (!chat) {
                pregunta.save((error:any, pregunta:any) => {
                    if (error) {
                        return res.status(500).json({
                            ok: false,
                            error
                        });
                    }
                    if (!pregunta) {
                        return res.status(400).json({
                            ok: false,
                            message: "Error"
                        });
                    }

                    return res.status(200).json({
                        ok: true,
                        message: "Pregunta Enviada"
                    });
                });
            }

            if(chat){
                modelpregunta.updateOne({ _id: body.id }, {
                    $push: {
                        mensajes: {
                            from: body.usuario,
                            body: body.body
                        }
                    }}                   
                ,{new:true},(error:any,pregunta:any)=>{
                    if (error) {
                        return res.status(500).json({
                            ok: false,
                            error
                        });
                    }
                    if (!pregunta) {
                        return res.status(400).json({
                            ok: false,
                            message: "Error"
                        });
                    }
                    
                    PreguntasController.activarChat(body.id);                 
                    return res.status(200).json({
                        ok: true,
                        message: "Pregunta Enviada"
                    });    
                });
            }
        });
    }

    static responder(req:Request,res:Response){
        let body = req.body;
        let id = body.id;

        modelpregunta.updateOne({ _id: id }, {
            $push: {
                mensajes: {
                    from: body.usuario,
                    body: body.body
                }
            }}    
        , { new: true }).exec((error:any, respuesta:any) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
            if (!respuesta) {
                return res.status(400).json({
                    ok: false,
                    message: "Error"
                });
            }
            PreguntasController.activarChat(body.id);
            // ControllerPreguntas.desactivarChat(body.id);
            return res.status(200).json({
                ok: true,
                message: "Respuesta Enviada"
            });
        });

    }

    static getRolePreguntas(req:Request,res:Response){
        let id = req.params.id;
        modelpregunta.find({activo:true         
        }).populate(             
               'miembros',null,{role:id}                         
        ).exec((error:any, preguntas:any) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                })
            }
            if (!preguntas) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error en los comentarios'
                })
            } 

            let getPreguntas = async (preguntas:any[])=>{
                let Cpreguntas=preguntas.filter( pregunta=>pregunta.miembros.length>0);
                return Cpreguntas;
            } 
            

            getPreguntas(preguntas).then((preguntas=>{
                return res.status(200).json({
                    ok:true,
                    preguntas
                });
            }))

                 
           
            // return res.status(200).json({
            //     xyz
            // })
           
         
        });

    }
    static getUserPreguntas(req:Request,res:Response){
        let id = req.params.id;
        modelpregunta.find({ "miembros": id }, { "miembros._id": false }).populate('mensajes.from').exec((error:any, preguntas:any) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                })
            }
            if (!preguntas) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error en los comentarios'
                })
            }

            return res.status(200).json({
                ok: true,
                preguntas
            });
        });

        
    }
    static getChat(req:Request,res:Response){
        let id = req.params.id;
        modelpregunta.find({ "_id": id }).populate('mensajes.from').exec((error:any, preguntas:any) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                })
            }
            if (!preguntas) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error en los comentarios'
                })
            }

            return res.status(200).json({
                ok: true,
                preguntas
            });
        });
    }
    static activarChat(id:string){
        modelpregunta.updateOne({ _id: id },{$set:{activo:true}},(error:any,activo:any)=>{
            if(error){
                console.log(error)
            }

        });
    }
    static desactivarChat(id:string){
        modelpregunta.updateOne({ _id: id },{$set:{activo:false}},(error:any,activo:any)=>{
            if(error){
                console.log(error)
            }

        });
    }








}
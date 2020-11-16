import {Request,Response } from "express";
import modelpublicidad from '../models/publicidad';
import uploadService from "./upload";

export default class PublicidadController {

    static crearAviso(req:Request,res:Response){
        let {titulo} = req.body;

        let a =new modelpublicidad({
            titulo        
        });

        a.save((err:any,publicidad:any)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    message:'Error desconocido',
                    err
                });
            }
            if(!publicidad){
                return res.status(401).json({
                    ok:false,
                    message:'Error No se encuentra',
                    err
                });
            }
            
            if(publicidad){
                return res.status(200).json({
                    ok:true,
                    publicidad
                });
            }           
        });
    }
    static editarAviso(req:Request,res:Response){
        let {_id,titulo} = req.body;

        modelpublicidad.update({_id},{$set:{
            titulo          
        }},(err:any,publicidad:any)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    message:'Error desconocido',
                    err
                });
            }
            if(!publicidad){
                return res.status(401).json({
                    ok:false,
                    message:'Error No se encuentra',
                    err
                });
            }
            
            if(publicidad){
                return res.status(200).json({
                    ok:true,
                    publicidad
                });
            }       
        });

    }
    static getAvisos(req:Request,res:Response){

        modelpublicidad.find().exec((err:any,publicidad:any)=>{

           if(err){
                return res.status(500).json({
                    ok:false,
                    message:'Error desconocido',
                    err
                });
            }
            if(!publicidad){
                return res.status(401).json({
                    ok:false,
                    message:'Error No se encuentra',
                    err
                });
            }
            
            if(publicidad){
                return res.status(200).json({
                    ok:true,
                    publicidad
                });
            }  

        }); 
    }
    static getAviso(req:Request,res:Response){
        let _id= req.params.id;

        modelpublicidad.find({_id}).exec((error:any,publicidad:any)=>{
            if(error){
                return res.status(500).json({
                    ok:false,
                    message:"Error Desconocido",
                    error
                });
            }

            if(!publicidad){
                return res.status(401).json({
                    ok:false,
                    message:"Error no se encuentra"               
                }); 
            }
            
            return res.status(200).json({
                ok:true,
                publicidad
            })

        });

    }
    static deleteAviso(req:Request,res:Response){
        let {_id,imagen}= req.body;

        modelpublicidad.deleteOne({_id},(err:any)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    message:'Error'
                })
            } 

            let categoria="categoria";

            uploadService.borraArchivo(imagen,categoria);

            return res.status(201).json({
                ok:true
            })
            
            
        })

    }

}



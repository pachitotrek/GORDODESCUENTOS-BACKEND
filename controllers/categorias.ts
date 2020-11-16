import {Request,Response } from "express";
import modelCategoria from '../models/categorias';
import modelLocation from '../models/location';
import uploadService from "./upload";

export default class CategoriasController{


    static crearCategoria(req:Request,res:Response){
        let {titulo,descripcion} = req.body;

        let a =new modelCategoria({
            titulo,
            descripcion
        });

        a.save((err:any,categoriadb:any)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    message:'Error desconocido',
                    err
                });
            }
            if(!categoriadb){
                return res.status(401).json({
                    ok:false,
                    message:'Error No se encuentra',
                    err
                });
            }
            
            if(categoriadb){
                return res.status(200).json({
                    ok:true,
                    categoriadb
                });
            }           
        });
    }
    static editarCategoria(req:Request,res:Response){
        let {_id,titulo,descripcion} = req.body;

        modelCategoria.update({_id},{$set:{
            titulo,
            descripcion
        }},(err:any,categoriaDB:any)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    message:'Error desconocido',
                    err
                });
            }
            if(!categoriaDB){
                return res.status(401).json({
                    ok:false,
                    message:'Error No se encuentra',
                    err
                });
            }
            
            if(categoriaDB){
                return res.status(200).json({
                    ok:true,
                    categoriaDB
                });
            }       
        });

    }
    static getCategorias(req:Request,res:Response){

        modelCategoria.find().exec((err:any,categoriasDB:any)=>{

           if(err){
                return res.status(500).json({
                    ok:false,
                    message:'Error desconocido',
                    err
                });
            }
            if(!categoriasDB){
                return res.status(401).json({
                    ok:false,
                    message:'Error No se encuentra',
                    err
                });
            }
            
            if(categoriasDB){
                return res.status(200).json({
                    ok:true,
                    categoriasDB
                });
            }  

        }); 
    }
    static getCategoria(req:Request,res:Response){
        let _id= req.params.id;

        modelCategoria.find({_id}).exec((error:any,categoriasDB:any)=>{
            if(error){
                return res.status(500).json({
                    ok:false,
                    message:"Error Desconocido",
                    error
                });
            }

            if(!categoriasDB){
                return res.status(401).json({
                    ok:false,
                    message:"Error no se encuentra"               
                }); 
            }
            
            return res.status(200).json({
                ok:true,
                categoriasDB
            })

        });

    }
    static deleteCategoria(req:Request,res:Response){
        let {_id,imagen}= req.body;

        modelCategoria.deleteOne({_id},(err:any)=>{
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
    static crearLocation(req:Request,res:Response){
        let {titulo,descripcion} = req.body;

        let a =new modelLocation({
            titulo,
            descripcion
        });

        a.save((err:any,locationdb:any)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    message:'Error desconocido',
                    err
                });
            }
            if(!locationdb){
                return res.status(401).json({
                    ok:false,
                    message:'Error No se encuentra',
                    err
                });
            }
            
            if(locationdb){
                return res.status(200).json({
                    ok:true,
                    locationdb
                });
            }           
        });
    }
    static editarLocation(req:Request,res:Response){
        let {_id,titulo,descripcion} = req.body;

        modelLocation.update({_id},{$set:{
            titulo,
            descripcion
        }},(err:any,locationdb:any)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    message:'Error desconocido',
                    err
                });
            }
            if(!locationdb){
                return res.status(401).json({
                    ok:false,
                    message:'Error No se encuentra',
                    err
                });
            }
            
            if(locationdb){
                return res.status(200).json({
                    ok:true,
                    locationdb
                });
            }       
        });

    }
    static getLocations(req:Request,res:Response){

        modelLocation.find().exec((err:any,locationdb:any)=>{

           if(err){
                return res.status(500).json({
                    ok:false,
                    message:'Error desconocido',
                    err
                });
            }
            if(!locationdb){
                return res.status(401).json({
                    ok:false,
                    message:'Error No se encuentra',
                    err
                });
            }
            
            if(locationdb){
                return res.status(200).json({
                    ok:true,
                    locationdb
                });
            }  

        }); 
    }
    static getLocation(req:Request,res:Response){
        let _id= req.params.id;

        modelLocation.find({_id}).exec((error:any,locationdb:any)=>{
            if(error){
                return res.status(500).json({
                    ok:false,
                    message:"Error Desconocido",
                    error
                });
            }

            if(!locationdb){
                return res.status(401).json({
                    ok:false,
                    message:"Error no se encuentra"               
                }); 
            }
            
            return res.status(200).json({
                ok:true,
                locationdb
            })

        });

    }
    static deleteLocation(req:Request,res:Response){
        let {_id,imagen}= req.body;

        modelLocation.deleteOne({_id},(err:any)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    message:'Error'
                })
            } 

            let lugar="lugar";

            uploadService.borraArchivo(imagen,lugar);

            return res.status(201).json({
                ok:true
            })
            
            
        })

    }


}



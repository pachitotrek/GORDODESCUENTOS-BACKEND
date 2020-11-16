import { Request, Response } from 'express';
import modelcupon from '../models/cupon';
import modelcategoria from '../models/categorias';
import modeluser from '../models/user';
import modelcomentario from '../models/comentarios';

export default class CuponController {

    static crearcupon(req: Request, res: Response) {

        let {
            usuario, categoria, location, titulo,
            restaurante, oferta, descripcion, fin,direccion
        } = req.body;


        let c = new modelcupon({
            usuario, categoria, location, titulo,
            restaurante, oferta, descripcion, fin,
            direccion,
            // rating: [],
            // comentarios: [],
            estado: 1
        });
        

        c.save((err: any, cuponDB: any) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error desconocido',
                    err
                });
            }
            if (!cuponDB) {
                return res.status(401).json({
                    ok: false,
                    message: 'Error al grabar'
                });
            }
            if (cuponDB) {
                return res.status(200).json({
                    ok: true,
                    cuponDB
                });
            }
        });



    }
    static editarcupon(req: Request, res: Response) {

        let {
            _id, usuario, categoria, location, titulo,
            restaurante, oferta, descripcion, fin, estado
        } = req.body;

        modelcupon.update({ _id }, {
            $set: {
                categoria,
                location,
                titulo,
                restaurante,
                oferta,
                descripcion,
                fin,
                estado
            }
        }, (err: any, cuponDB: any) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error desconocido',
                    err
                });
            }
            if (!cuponDB) {
                return res.status(401).json({
                    ok: false,
                    message: 'Error al grabar'
                });
            }
            if (cuponDB) {
                return res.status(200).json({
                    ok: true,
                    cuponDB
                });
            }
        })



    }
    static getcupones(req: Request, res: Response) {
        let query= req.query;  
        let search:any= {};
        (query.categoria)? (search.categoria= query.categoria):"";
        (query.location)? (search.location= query.location):"";      

        modelcupon.find(search).populate('categoria','titulo').populate('usuario','username imagen').populate('location','titulo').exec((err:any,cupones:any)=>{
            if (err) {
                return res.status(501).json({
                    ok: false,
                    message: 'Error desconocido',
                    err
                });
            }
            if (!cupones) {
                return res.status(401).json({
                    ok: false,
                    message: 'Error al grabar'
                });
            }
            if (cupones) {
                return res.status(200).json({
                    ok: true,
                    cupones
                });
            }
        })
    }
    static getcupon(req:Request,res:Response){
        let _id = req.params.id;

        modelcupon.find({_id}).populate('usuario','username imagen').populate('categoria','titulo').populate('location','titulo').exec((err:any,cupon:any)=>{
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error desconocido',
                    err
                });
            }
            if (!cupon) {
                return res.status(401).json({
                    ok: false,
                    message: 'Error al grabar'
                });
            }
            if (cupon) {
                return res.status(200).json({
                    ok: true,
                    cupon
                });
            }
        })
    }
    static putLike(req:Request,res:Response){        
    }
    static getcomentarios(req:Request,res:Response){
        let _id = req.params.id;
        modelcomentario.find({"cupon":_id}).populate('mensajes.from','username imagen').exec((err:any,comentarios:any)=>{
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error desconocido',
                    err
                });
            }
            if (!comentarios) {
                return res.status(401).json({
                    ok: false,
                    message: 'Error al grabar'
                });
            }
            if (comentarios) {
                return res.status(200).json({
                    ok: true,
                    comentarios
                });
            }
        })
    }
    static async setcomentario(req:Request,res:Response){

        let {usuario,mensaje,cupon} = req.body;

        let result = await CuponController.searchComment(cupon).then((data:any)=>{           
            return data;    
        }).catch((err:any)=>{
            return false;
        });  
        
        if(result){
            modelcomentario.updateOne({cupon},{ $push:{ 
                mensajes:[
                    {
                        from:usuario,
                        body:mensaje,
                    }
                ]
             }}).exec((err:any,comentario:any)=>{
                if(err){
                    return res.status(501).json({
                        ok:false,
                        message:"Error"
                    });
                }
                if(!comentario){
                    return res.status(401).json({
                        ok:false,
                        message:'Error No se encuentra el documento'
                    });
                }
                if(comentario){
                    return res.status(201).json({
                        ok:true,
                        comentario
                    });
                }
             });
        }else{
            let newcomentario = new modelcomentario({
                cupon,
                mensajes:[
                    {
                        from:usuario,
                        body:mensaje
                    }
                ]
            });
            newcomentario.save((err:any,comentario:any)=>{
                if(err){
                    return res.status(501).json({
                        ok:false,
                        message:"Error"
                    });
                }
                if(!comentario){
                    return res.status(401).json({
                        ok:false,
                        message:'Error No se encuentra el documento'
                    });
                }
                if(comentario){

                    CuponController.updatecupon(cupon,comentario._id);

                    return res.status(201).json({
                        ok:true,
                        comentario
                    });
                }  
            });
        }      
    }
    static searchComment(cupon:any){      
        return new Promise ((resolve:any,reject:any)=>{
            modelcomentario.findOne({cupon:cupon}).exec((err:any,cupondb:any)=>{
                if(err){
                    reject('Error',err)
                }
                if(!cupondb){                   
                    resolve(false);
                }
                if(cupondb){               
                    resolve(true);
                }
            }); 
        });
    }
    static updatecupon(cupon:any,comentario:any){
        modelcupon.updateOne({_id:cupon},{
            $set:{
                comentarios:comentario
            }
        }).exec((err:any,cupon:any)=>{
            console.log("Error");
        });
    }
    static deletecupon(req:Request,res:Response){
        let {comentario,cupon} = req.body;       
        modelcomentario.updateOne({'cupon':cupon},{$pull:{
            'mensajes':{'_id':comentario}
        }}).exec((err:any,comentario:any)=>{
                if(err){             
                    return res.status(500).json({
                        ok:false,
                        message:'error'
                    });
                }
                if(!comentario){
                    return res.status(401).json({
                        ok:false,
                        message:'error no se encuentra'
                    }); 
                }
                if(comentario){
                    return res.status(201).json({
                        ok:true,
                        comentario
                    }); 
                }
        });

    }
    



}
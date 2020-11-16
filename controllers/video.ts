var modelVideo = require ('../models/video');
import {Request,Response } from "express";

export default class VideosController{

    static getLastVideos(req:Request,res:Response){
        let id = req.params.id;

        modelVideo.find({categoria:{$ne:id}}).sort({_id:-1}).populate('categoria'   
        ).exec((error:any,videos:any)=>{           
            return res.status(200).json({
                ok:true,
                videos
            })
        });
    }

    static getLastVideo(req:Request,res:Response){
        modelVideo.find().sort({_id:1}).limit(1).populate('videos.categoria').exec((error:any,videos:any)=>{
            return res.status(200).json({
                ok:true,
                videos
            })
        });
    }

    static getVideo(req:Request,res:Response){
        let id = req.params.id;
        modelVideo.findOne({"_id":id}).populate('categoria').exec((error:any,video:any)=>{
            return res.status(200).json({
                ok:true,
                video
            })
        });

    }

    static getVideos(req:Request,res:Response){
        let id = req.params.id;
        modelVideo.find({"categoria":id}).sort({_id:1}).populate('categoria').exec((error:any,videos:any)=>{
            return res.status(200).json({
                ok:true,
                videos
            })
        });
    }




}

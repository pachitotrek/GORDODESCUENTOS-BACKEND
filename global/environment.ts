
export const SERVER_PORT:number = Number(process.env.PORT) || 3100;
export const DBURL:string = 'mongodb://localhost:27017/fat';
export const CADUCIDAD_TOKEN:number=Number(process.env.CADUCIDAD_TOKEN) ||60*60*24*30;
export const SEED:string= process.env.SEED || 'este-es-el-seed-desarrollo';
export const CLIENT_ID:string='416899597802-5nf0egipotbr8argtcqok3mpdk2ref2d.apps.googleusercontent.com'; 


//========================
//entorno
//========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; 



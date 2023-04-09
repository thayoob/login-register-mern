import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json())

app.use(express.urlencoded())
app.use(cors())


const uri = 'mongodb+srv://muyyuddeenthayoob:Thayub2021@thayoob.k1h1qpk.mongodb.net/?retryWrites=true&w=majority'

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log('Successful connection to MongoDB');
    } catch (error) {
        console.log(error);
    }
}
connect()

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String

})
const User = new mongoose.model('User', userSchema)

//servering the frontend
app.use(express.static(path.join(__dirname,'./login-signup-app/build')));
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'./login-signup-app/build/index.html'),(err)=>{
        res.status(500).send(err)
    })
})
//routes
//login router
app.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try{
        const user= await User.findOne({email:email});
        if(user){
            if(password===user.password){
                res.send({message:'Login Seccessfully',user:user})
            }else{
                res.send({message:"Password didn't mach"})
            }
        }else{
            res.send({message:'User not registered'})
        }
    }catch(err){
        console.log(err);
    }
})

//register routor
app.post('/register', async(req, res) => {
    const { name, email, password } = req.body
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            res.send({ message: 'user already registerd' })
        } else {
             const user=new User({
                name,
                email,
                password
             })
             await user.save()
             .then(res.send({message:'Successfully Registerd,Please login Now..'}))
             .catch(err=>res.send(err))
        }
    } catch (err) {
        console.log(err);
    }
})
app.listen(5000, () => {
    console.log("Be started at port 5000");
})
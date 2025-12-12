const bcrypt = require("bcrypt");
const UserModel = require("../models/User");
const salt = bcrypt.genSaltSync(10);

exports.register = async (req,res) =>{
    const {username,password} =req.body;
        if(!username || !password){
            return res.status(400).send({message:"Please provide username and password"});
        }
        const existingUser = await UserModel.findOne({username});
        if(existingUser){
            return res(400).send({message:"Username is already used"});
        }
        try{
            const hashedPassword = bcrypt.hashSync(passeord,salt);
            const user = await UserModel.create({
                username,
                password: hashedPassword,
            });
            res.send({message:"User registered successfully"});
        }catch(error){
            res.status(500).send({message:e.message || "Somethig occurred while registering a new user"})
        }
    }
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    UserController: {
        signIn: async (req, res) => {
            try{
                //ค้นหา user
                const user = await prisma.user.findFirst({
                    where: { 
                    username: req.body.username,
                    password: req.body.password,
                    status: "active"
                }
            });

            //ตรวจสอบ user แล้วไม่พบ return ค่ากลับไป
            if(!user) return res.status(401).json({ massage: "User not found!!!"});

            //ถ้าตรวจสอบแล้วพบ user ก็สร้าง token ด้วย id มีอายุ 1 เดือน
            const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "30d"});  
            
            //ส่ง token กลับไป
            res.status(200).json({ token: token });
            
            }catch(error) {
                console.error("Error in signIn:", error);
                res.status(500).json({message: error.message});
            }
        }
    }
};
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { info } = require("console");
const { decode } = require("punycode");
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
        },
        info: async (req, res) => {
            try {
                const hesder = req.headers.authorization;
                const token = hesder.split(" ")[1];
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                const user = await prisma.user.findFirst({
                    where: { id: decoded.id },
                    select: {
                        name: true,
                        level: true,
                        username: true
                    }
                });
                res.json(user); 
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            
        },
        update: async (req, res) => {
            try {
                const headers = req.headers.authorization; //รับ headers เข้ามา
                const token = headers.split(" ")[1]; //split header เอา token
                const decoded = jwt.verify(token, process.env.SECRET_KEY); //ถอดรหัสเอาไอดี
                const oldUser = await prisma.user.findFirst({
                    where: { id: decoded.id }
                });
                //ถ้ามีค่าใหม่ ? ก็เอาตามที่กรอก : ถ้าไม่ก็ค่าเดิม
                const newPassword = req.body.password !== "" ? req.body.password : oldUser.password;
                await prisma.user.update({ //ค้น user ออกมา
                    where: { id: decoded.id }, //ตาม id ที่พบ
                    data: { //เปลี่ยนข้อมูล 
                        name: req.body.name,
                        username: req.body.username,
                        password: newPassword,
                    }
                });
                res.json({ message: "success"});
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        }
    }
};
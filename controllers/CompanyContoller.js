const { PrismaClient } = require("@prisma/client");
const { create } = require("domain");
const prisma = new PrismaClient();

module.exports = {
    CompanyController: {
        create: async (req, res) => {
            try {
                const oldCompany = await prisma.company.findFirst(); //ค้นหาข้อมูลบริษัทตัวแรก
                const payload = {
                    name: req.body.name,
                    address: req.body.address,
                    phone: req.body.phone,
                    email: req.body.email ?? '',
                    taxCode: req.body.taxCode
                }

                if (oldCompany) {
                    await prisma.company.update({ //ถ้ามีข้อมูลอยู่แล้วให้อัปเดต
                        where: { id: oldCompany.id },
                        data: payload
                    });
                }else {
                    await prisma.company.create({ //ถ้าไม่มีข้อมูลให้สร้างใหม่
                        data: payload
                    });
                } 
                
                res.json({ message: "success" });

            }catch (err) {
                res.status(500).json({ error: err.message });
            }
        },
        //เก็บข้อมูลไว้ให้หน้าบ้านใช้งาน //เพิ่ม api สำหรับดึงข้อมูล
        list: async (req, res) => {
            try {
                const company = await prisma.company.findFirst(); //ดึงข้อมูลบริษัทตัวแรก
                res.json(company);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        }
    }
};
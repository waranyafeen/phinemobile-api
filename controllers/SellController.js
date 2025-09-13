const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { error } = require("console");
dotenv.config();

module.exports = {
    SellController: {
        create: async (req, res) => {
            try {
                const serial = req.body.serial; //หาสินค้า
                const product = await prisma.product.findFirst({ //ค้น product ตาม serial
                    where: { 
                        serial: serial ,
                        status: 'in stock'
                    }
                });

                //ถ้าหาแล้วไม่มีก็แจ้ง 404 
                if (!product) {
                    res.status(400).json({ message: "Product not found" });
                    return;
                }

                //ถ้ามีก็บันทึกในนี้
                await prisma.sell.create({
                    data: {
                        productId: product.id,
                        price: req.body.price,
                        payDate: new Date()
                    }
                });
                res.json({ message: "success"});
            }catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        list: async (req, res) => {
            try {
                const sells = await prisma.sell.findMany({
                    where: { 
                        status: 'pending'
                    },
                    orderBy: {
                        id: 'desc'
                    },
                    select: {
                        product: {
                            select: {
                                serial: true,
                                name: true
                            }
                        },
                        id: true,
                        price: true
                    }
                }) 
                res.json(sells);
            }catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        remove: async (req, res) => {
            try {
                await prisma.sell.delete({ //ค้นหาและลบตาม id 
                    where: {
                        id: req.params.id
                    }
                });
                res.json({ message: "success"});
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        confirm: async (req, res) => {
            try {
                const sells = await prisma.sell.findMany({
                    where: {
                        status: 'pending'
                    }
                });

                for (const sell of sells) {
                    await prisma.product.update({
                        data: {
                            status: 'sold'
                        },
                        where: {
                            id: sell.productId
                        }
                    })
                };

                await prisma.sell.updateMany({
                    where: {
                        status: 'pending' //อัปเดตจาก สถานะที่รอจ่ายตัง
                    },
                    data: {
                        status: 'paid',  //ให้เป็นจ่ายแล้ว
                        payDate: new Date() 
                    }
                });
                res.json({ message: "success" });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        dashboard: async (req, res) => {
            try {
                const year = Number(req.params.year) ?? new Date().getFullYear();
                const startDate = new Date(`${year}-01-01`);
                const endtDate = new Date(`${year + 1}-01-01`);

                //total income
                const income = await prisma.sell.aggregate({
                    _sum: { //หาผลรวม รายได้ทั้งหมด
                        price: true
                    },
                    where: { //จากสถานะการจ่ายเงิน
                        status: 'paid',
                        payDate: {
                            gte: startDate,
                            lt: endtDate
                        }
                    }
                });

                //total repair
                const countRepair = await prisma.service.count(); 

                //total sell
                const countSell = await prisma.sell.count({ //นับจากที่จ่ายตัง
                    where: {
                        status: 'paid',
                        payDate: {
                            gte: startDate,
                            lt: endtDate
                        }
                    }
                });

                return res.json({
                    totalIncome: income._sum.price,
                    totalRepair: countRepair,
                    totalSale: countSell
                });

            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        history: async (req, res) => {
            try {
                const sells = await prisma.sell.findMany({
                    where: {
                        status: 'paid'
                    },
                    orderBy: {
                        id: 'desc'
                    },
                    include: {
                        product: {
                            select: {
                                serial: true,
                                name: true
                            }
                        }
                    }
                });
                res.json(sells);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        info: async (req, res) => {
            try {
                const sell = await prisma.sell.findUnique({
                    where: {
                        id: req.params.id,
                        status: 'paid'
                    },
                    include: {
                        product: true
                    }
                });
                res.json(sell);
            } catch(error) {
                res.status(500).json({ message: error.message });
            }
        }
    }
}
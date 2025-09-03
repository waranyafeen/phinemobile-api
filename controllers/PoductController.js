const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    ProductController: {
        create: async (req, res) => {
            try {
                const qty = req.body.qty;

                //กันผิดพลาด กำหนดให้ qty ต้องไม่เกิน 10,000 ชิ้น
                if (qty > 10000) {
                    res.status(400).json({ error: "Quantity exceeds limit, qty must be less than 10000" });
                    return;
                }

                for (let i = 0; i < qty; i++) {
                    await prisma.product.create({
                        data: {
                            serial: req.body.serial ?? '',
                            release: req.body.release,
                            name: req.body.name,
                            color: req.body.color,
                            price: req.body.price,
                            customerName: req.body.customerName,
                            customerPhone: req.body.customerPhone,
                            customerAddress: req.body.customerAddress,
                            remark: req.body.remark ?? ''
                        }
                    });
                }
                res.json({ message: "success" });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        },
        list: async (req, res) => {
            try {
                const products = await prisma.product.findMany({
                    orderBy: {
                        id: "desc"
                    },
                    where: {
                        status: {
                            not: "Delete"
                        }
                    }
                });
                res.json(products);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        },
        update: async (req, res) => {
            try {
                await prisma.product.update({
                    where: { id: req.params.id},
                    data: {
                        serial: req.body.serial ?? '',
                        release: req.body.release,
                        name: req.body.name,
                        color: req.body.color,
                        price: req.body.price,
                        customerName: req.body.customerName,
                        customerPhone: req.body.customerPhone,
                        customerAddress: req.body.customerAddress,
                        remark: req.body.remark ?? ''
                    }
                });
                res.json({ message: "success" });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        },
        remove: async (req, res) => {
            try {
                await prisma.product.update({
                    where: { id: req.params.id },
                    data: { status: "Delete" }
                });
                res.json({ message: "success" });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        }
    }
}
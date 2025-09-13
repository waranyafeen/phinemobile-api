const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const XLSX = require('xlsx');

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
                const page = req.params.page ?? 1;
                const limit = 5;
                const skip = (page -1) * limit;
                const totalRows = await prisma.product.count({
                    where: {
                        status: {
                            not: 'delete'
                        }
                    }
                });
                const totalPages = Math.ceil(totalRows / limit);

                const products = await prisma.product.findMany({
                    orderBy: {
                        id: "desc"
                    },
                    where: {
                        status: {
                            not: "Delete"
                        }
                    },
                    skip: skip,
                    take: limit
                });
                res.json({ products, totalPages, page, totalRows});
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
        },
        exportToExcel: async (req, res) => {
            try {
                const data = req.body.products;
                const fileName = 'products.xlsx';

                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

                //write to file
                XLSX.writeFile(workbook, './uploads/' + fileName);
                res.json({ fileName: fileName });
            } catch(err) {
                res.status(500).json({ message: err.message });
            }
        }
    }
}
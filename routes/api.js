const express = require('express');
const router = express.Router();
const database = require('../config/connect');
const DistributorModel = require('../model/Distributor');
const FruitModel = require('../model/fruits');
const Upload = require('../config/common/upload');

// const unidecode = require('unidecode');

// distributor
router.get('/get-distributor', async (req, res) => {
    try {
        let distributor = await DistributorModel.find().populate();
        console.log(distributor);
        res.json({
            "status": 200,
            "messenger": "Danh sách distributor",
            "data": distributor
        })
    } catch (error) {
        console.log(error);
    }

    // res.send(distributor)
})
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
router.get('/search-distributor', async (req, res) => {
    const key = req.query.key;
    try {
        // const searchTitle = unidecode(title);
        // const searchNameWithAccents = removeAccents(title);
        // const results = await DistributorModel.find({
        //     $or: [
        //         // { title: { "$regex": title, "$options": "i" } },
        //         // { title: { "$regex": searchTitle, "$options": "i" } }
        //         { title: { $regex: new RegExp(title, "i") } },
        //         { title: { $regex: new RegExp(searchTitle, "i") } }
        //     ]
        // });
        const data = await DistributorModel.find({ title: { $regex: new RegExp(key, "i") } })
            .sort({ createdAt: -1 });
        if (data) {
            res.json({
                "status": 200,
                "messenger": "Thành công",
                "data": data
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, không thành công",
                "data": []
            })
        }
        // res.send(results);
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({ error: "Đã xảy ra lỗi khi tìm kiếm" });
    }
});
// Thêm sản phẩm
router.post("/add-distributor", async (req, res) => {
    database.connect();
    try {
        const { title } = req.body;

        // Tạo một instance mới của model sản phẩm
        const newDistributor = new DistributorModel({
            //    title
            title: title
        });

        // Lưu sản phẩm mới vào cơ sở dữ liệu
        const savedDistributor = await DistributorModel.create(newDistributor);

        res.status(201).json(savedDistributor); // Trả về sản phẩm vừa được tạo thành công
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Sửa sản phẩm
router.put("/update-distributor/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        const updatedDistributor = await DistributorModel.findByIdAndUpdate(
            id,
            { title },
            { new: true }
        );

        if (!updatedDistributor) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        res.json(updatedDistributor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Xóa sản phẩm
router.delete("/delete-distributor/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedDistributor = await DistributorModel.findByIdAndDelete(id);

        if (!deletedDistributor) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        res.json({ message: "Xóa sản phẩm thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// fruits
router.get('/get-fruit', async (req, res) => {
    try {
        let data = await FruitModel.find().populate('id_distributor');
        console.log(data);
        res.json({
            "status": 200,
            "messenger": "Danh sách Fruit",
            "data": data
        })
    } catch (error) {
        console.log(error);
    }
    // res.send(distributor)
})

//upload image
router.post('/add-fruit-with-file-image', Upload.array('image', 5), async (req, res) => {
    //Upload.array('image',5) => up nhiều file tối đa là 5
    //upload.single('image') => up load 1 file
    try {
        const data = req.body; // Lấy dữ liệu từ body
        const { files } = req //files nếu upload nhiều, file nếu upload 1 file
        const urlsImage =
            files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`)
        //url hình ảnh sẽ được lưu dưới dạng: http://localhost:3000/upload/filename
        const newfruit = new FruitModel({
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            image: urlsImage, /* Thêm url hình */
            description: data.description,
            id_distributor: data.id_distributor
        }); //Tạo một đối tượng mới
        const result = (await newfruit.save()).populate("id_distributor"); //Thêm vào database
        if (result) {// Nếu thêm thành công result !null trả về dữ liệu
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        } else {// Nếu thêm không thành công result null, thông báo không thành công
            res.json({
                "status": 400,
                "messenger": "Lỗi, thêm không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
});
router.put('/update-fruit-by-id/:id', Upload.array('image', 5), async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const { files } = req;
        const urlsImage =
            files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);
        const updatefruit = await FruitModel.findByIdAndUpdate(id)
        files.map((file) => console.log(123, file.filename));
        console.log(345, updatefruit.image);

        let result = null;
        if (updatefruit) {
            updatefruit.name = data.name ?? updatefruit.name,
                updatefruit.quantity = data.quantity ?? updatefruit.quantity,
                updatefruit.price = data.price ?? updatefruit.price,
                updatefruit.status = data.status ?? updatefruit.status,
                updatefruit.image = urlsImage ?? updatefruit.image,
                updatefruit.description = data.description ?? updatefruit.description,
                updatefruit.id_distributor = data.id_distributor ?? updatefruit.id_distributor,
                result = await updatefruit.save();
        }
        if (result) {
            res.json({
                'status': 200,
                'messenger': 'Cập nhật thành công',
                'data': result
            })
        } else {
            res.json({
                'status': 400,
                'messenger': 'Cập nhật không thành công',
                'data': []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

//delete fruit
router.delete('/delete-fruit-by-id/:id', async (req, res) => {
    try {
        const { id } = req.params
        const result = await FruitModel.findByIdAndDelete(id);
        if (result) {
            res.json({
                "status": 200,
                "messenger": "Xóa thành công",
                "data": result
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi! xóa không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

// check token
// const firebaseAdmin = require('firebase-admin');
// const serviceAccount = require('../config/common/qldt-5b445-firebase-adminsdk-lm70g-88f2d16ebc.json');

// firebaseAdmin.initializeApp({
//     credential: firebaseAdmin.credential.cert(serviceAccount),
// });

// // Middleware để xác thực token
// const authenticateToken = async (req, res, next) => {
//     const token = req.headers.authorization;

//     if (!token) {
//         return res.status(401).json({ error: 'Access denied. Token is required.' });
//     }

//     try {
//         const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
//         req.user = decodedToken;
//         next();
//     } catch (error) {
//         return res.status(401).json({ error: 'Invalid token.' });
//     }
// };
// router.get('/get-fruit-authenticate-token', authenticateToken, async (req, res) => {
//     try {
//         let data = await FruitModel.find().populate('id_distributor');
//         console.log(data);
//         res.json({
//             "status": 200,
//             "messenger": "Danh sách Fruit",
//             "data": data
//         })
//     } catch (error) {
//         console.log(error);
//     }
//     // res.send(distributor)
// })

module.exports = router;
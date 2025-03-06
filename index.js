// require("dotenv").config();
const express = require("express");

const multer = require("multer");
const podcastRoutes = require("./API/routes/podcastRoutes");
const path = require("path");
const fs = require("fs");

const app = express();
const authRoutes = require('./API/routes/auth');
//middleware theeek h
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended : false}));
app.use('/api/auth',authRoutes);

const PORT =  8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "audio/mpeg" || file.mimetype === "audio/wav") {
            cb(null, true);
        } else {
            cb(new Error("File format not supported"));
        }
    }
}
);

app.get("/", (req, res) => {
    res.send("Welcome to Podcast API");
});

app.get("/uploads", (req, res) => {
    fs.readdir(path.join(__dirname, "uploads"), (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to read files" });
        } else {
            res.status(200).json({ files });
        }
    });
});

app.post("/upload", upload.single("file") ,(req, res) => {
    console.log(req.file);
    res.send("File uploaded successfully");

});

app.delete("/delete/:filename", (req, res) => {
    const filePath = path.join(__dirname, "uploads", req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to delete file" });
        } else {
            res.status(200).json({ message: "File deleted successfully" });
        }
    });
});






// API Routes
// app.use("/api/podcasts", podcastRoutes);

// //
// app.use((err, req, res, next) => {
//     console.error("Error Stack:", err.stack);
//     res.status(500).json({ message: err.message || "Something went wrong!" });
//     next();
// });










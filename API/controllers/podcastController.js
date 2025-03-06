const axios = require("axios");
let podcasts = [];

const uploadPodcast = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Please upload an audio file" });
    }
    const { title } = req.body;
    const audioPath = req.file.path;
    try {
        const transcript = "Podcast about AI technology and future innovations.";

        const response = await axios.post(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
            { inputs: `Summarize this: ${transcript}` },
            {
                headers: { Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}` }
            }
        );

        const summary = response.data[0].generated_text;
        const newPodcast = { title, audioPath, transcript, summary, createdAt: new Date() };
        podcasts.push(newPodcast);

        res.status(201).json({ message: "Podcast Summarized ✅", podcast: newPodcast });
    } catch (error) {
        console.error("Mistral AI Error:", error.message);
        res.status(500).json({ message: "Failed to Summarize Podcast" });
    }
};

const getPodcasts = (req, res) => {
    res.status(200).json(podcasts);
};

const deletePodcast = (req, res) => {
    const { title } = req.params;
    const index = podcasts.findIndex(p => p.title === title);

    if (index === -1) {
        return res.status(404).json({ message: "Podcast not found" });
    }

    podcasts.splice(index, 1);
    res.status(200).json({ message: "Podcast Deleted ❌" });
};

module.exports = { uploadPodcast, getPodcasts, deletePodcast };

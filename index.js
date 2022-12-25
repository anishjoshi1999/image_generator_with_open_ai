const express = require("express")
const dotenv = require("dotenv").config()
const ejsMate = require('ejs-mate')
const port = process.env.PORT || 3000
const app = express()
const cors = require('cors')
const path = require('path')
// Configuring openai with openai api key
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// default setting
app.use(cors())
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(__dirname + '/public'));
// Enable body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// Routes
app.get('/', (req, res) => {
    res.redirect('/openai')
})
app.get('/openai', (req, res) => {
    res.render('home')
})
// for dall-e 
// showing a form to make a request with dalle
app.get('/openai/generateimage', (req, res) => {
    res.render('openai/dalle/new')
})
app.post('/openai/generateimage', async (req, res) => {
    const { prompt, size } = req.body
    const imageSize = size === 'small' ? '256x256' : size === 'medium' ? '512x512' : '1024x1024'
    try {
        const response = await openai.createImage({
            prompt,
            n: 1,
            size: imageSize
        })
        const imageUrl = response.data.data[0].url
        res.render('openai/dalle/show', { imageUrl, prompt })
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
        res.status(400).json({
            success: false,
            error: "The image could not be generated"
        })
    }
})
app.get('/openai/chatgpt', (req, res) => {
    const newResponse = ''
    res.render('openai/chatgpt/show',{newResponse})
})
app.post('/openai/chatgpt',async(req,res)=> {
    try {
        const queries = []
        const {prompt} = req.body 
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 64,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0
          });
          res.render('openai/chatgpt/show',{prompt,newResponse:response.data.choices[0].text})
    } catch (error) {
        console.log(error)
        res.status(500).send("error")
    }
})
app.listen(port, () => {
    console.log(`Server started on ${port}`)
})

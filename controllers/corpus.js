const logger = require('@log')
const { handleError } = require('@controllers/error')
const axios = require('axios')
require('dotenv').config()

//Get definition and pragmatics data for a certian word and pos
exports.getWordInfo = async (req, res) =>{
    const {word, pos} = req.query

    Promise.allSettled([getDictDefinition(word), getCorpusData(word, pos)]).then(results=>{
        let definitions = results[0].value;
        definitions = definitions.map(def=>trimDef(def));
        let gramrels = results[1].value;
            return res.json({
                word,
                definitions,
                gramrels
            })
    }).catch(err=>{
        return handleError(err, 400, res)
    })
}

//Get and trim definition data
const getDictDefinition = async(word)=>{
    const res = await axios.get(`https://dictionaryapi.com/api/v3/references/learners/json/${word}`, {params: {key: process.env.MW_KEY}})
    const {data} = res;
    const definition = data[0]['meta']['app-shortdef']['def']
    return definition
}

//Get and trim pragmatics data
const getCorpusData = async(word, pos, corpusName='preloaded/bnc2')=>{
    const USERNAME = process.env.SKETCH_USERNAME;
    const API_KEY = process.env.SKETCH_KEY;

    const lpos_dict = {
        adjective: "-j",
        verb: "-v",
        noun: "-n",
        pronoun: "-d",
        adverb: "-a"
      }

    const res = await axios.get(process.env.SKETCH_URL, {params:{
        corpname: corpusName,
        format: 'json',
        lemma: word,
        lpos: lpos_dict[pos],
    }, auth: {
        username: USERNAME,
        password: API_KEY
    }})

    const gramrels = res.data.Gramrels.filter(gramrel => gramrel.name !== 'usage patterns')
    return gramrels
}

function trimDef(str) {
    const regex = /\{.*\}/g
    return str.replace(regex, '').trim()
}
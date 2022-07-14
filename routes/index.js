import express from 'express'
import db from '../db.js'
const router = express.Router()


/* GET página inicial */
router.get('/', async (req, res, next) => {
  try {
    // pega todas as pessoas e zumbis do banco de dados
    // duas formas: (1) em sequência, (2) em paralelo (melhor)
    //
    // (1) em sequência (ruim, pq é desnecessário esperar):
    // const people = await db.execute(`SELECT id, name, alive
    //                                  FROM person`)
    // const zombies = await db.execute(`SELECT id, name, pictureUrl
    //                                   FROM zombie`)
    //
    // (2) consultas feitas em paralelo ao banco:
    const [
      [people],
      [zombies]
    ] = await Promise.all([
      db.execute(`SELECT id, name, alive
                  FROM person`),
      db.execute(`SELECT id, name, pictureUrl
                  FROM zombie`)
    ])


    // renderiza a view index
    res.render('index', {
      zombies,
      people,

      // req.flash é uma forma de comunicar algo efêmero à view
      // (tipo uma mensagem de sucesso/erro após uma operação)...
      // o método .flash é injetado em req graças ao pacote
      // connect-flash (veja o package.json)
      success: req.flash('success'),
      error: req.flash('error'),
      peopleCountChange: req.flash('peopleCountChange'),
      zombieCountChange: req.flash('zombieCountChange')
    })

  } catch (error) {
    console.error(error)
    error.friendlyMessage = 'Erro ao recuperar pessoas ou zumbis. Eles não podem ser recuperados... brains'
    next(error)
  }
})

export default router
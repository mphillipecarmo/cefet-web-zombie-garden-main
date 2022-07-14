import express from 'express'
import db from '../db.js'
import { getMySQLDate, getReadableDateString } from '../db-utils.js'
const router = express.Router()


/* GET lista de zumbis. */
router.get('/', async (req, res, next) => {
  try {
    const [zombies] = await db.execute('SELECT * FROM zombie')
    
    // negociação de conteúdo
    res.format({
      html: () => res.render('list-zombies', { zombies }),
      json: () => res.json({ zombies })
    })

  } catch (error) {
    console.error(error)
    error.friendlyMessage = 'Não foi possível recuperar a lista de zumbis'
    next(error)
  }
})


/* GET detalhes de um zumbi. */
router.get('/:id', async (req, res, next) => {
  try {
    const [zombies] = await db.execute({
      sql: `SELECT *
            FROM zombie
            LEFT OUTER JOIN zombie biter
              ON zombie.bittenBy=biter.id
            WHERE zombie.id=?`,
      values: [req.params.id],
      nestTables: true
    })


    // negociação de conteúdo: responde em HTML (ie, renderiza a view) se
    // a requisição tem o cabeçalho "Accepts: text/html", ou em JSON se
    // "Accepts: application/json"
    res.format({
      html: () => {
        if (zombies.length > 0) {
          zombies[0].zombie.born = getReadableDateString(zombies[0].zombie.born)
          res.render('details-zombie', { zombie: zombies[0] })
        } else {
          throw new Error('Zumbi não encontrado. Tente novamente de noite.')
        }
      },
      json: () => {
        if (zombies.length > 0) {
          res.json({ zombie: zombies[0] })
        } else {
          res.status(404).send({})
        }
      }
    })


  } catch (error) {
    console.error(error)
    error.friendlyMessage = `Erro desconhecido ao buscar detalhes do zumbi ${req.params.id}`
    next(error)
  } 

})


/* POST cria um novo zumbi a partir de uma pessoa */
router.post('/brains', async (req, res, next) => {
  const personId = req.body.person
  if (!personId) {
    req.flash('error', 'Nenhuma pessoa selecionada!')
    res.redirect('/')
    return;
  }
  
  // busca nome da pessoa mordiscada
  // criar um novo zumbi com nome similar ao da pessoa
  // e excluir a pessoa
  const transaction = await db.getConnection()
  try {
    const [person] = await db.execute('SELECT name FROM person WHERE id=?', [personId])

    if (!person || person.length < 1) {
      req.flash('error', 'Pessoa não encontrada!')
      res.redirect('/')
      return;
    }

    const previousName = person[0].name
    const newName = getZombieNameFromPerson(previousName)
    const born = getMySQLDate(new Date())
    const picIndex = getPictureIndex()
    const biterId = req.body.zombie

    await transaction.beginTransaction()
    const [insertResult] = await transaction.execute(
      `INSERT INTO zombie (id, name, born, previousName, pictureUrl, bittenBy)
       VALUES (NULL, ?, ?, ?, ?, ?)`,
      [newName, born, previousName, `zombie${picIndex}.jpg`, biterId]
    )

    if (!insertResult || insertResult.insertedRows < 1) {
      throw new Error(`Não inseriu um novo zumbi na tabela graças à pessoa com id ${personId}`)
    }

    const [deleteResult] = await transaction.execute(
      `DELETE
       FROM person
       WHERE id=?`,
      [personId]
    )

    if (!deleteResult || deleteResult.affectedRows < 1) {
      throw new Error(`Não excluiu a pessoa com id ${personId}`)
    }
    await transaction.commit()

    res.format({
      html: () => {
        req.flash('peopleCountChange', '-1')
        req.flash('zombieCountChange', '+1')
        req.flash('success', `Um novo zumbi se mudou para o jardim: ${newName}`)
        res.redirect('/')
      },
      json: () => res.status(200).send({})
    })

  } catch (error) {
    try {
      if (transaction) {
        await transaction.rollback()
      }
    } catch (transactionError) {
      // just ignore
    }
    console.error(error)
    error.friendlyMessage = 'Erro ao mordiscar. Talvez estivesse estragado'
    next(error)
  } finally {
    transaction.release()
  }
  
})



// Flávio Coutinho --> Zlávio (não começa com vogal)
// Elder --> Zelder (começa com vogal)
function getZombieNameFromPerson(personName) {
  const firstName = personName.split(' ')[0].toLowerCase()
  const startsWithVowel = ['a', 'e', 'i', 'o', 'u', 'w', 'y'].indexOf(firstName[0]) === 0
  return startsWithVowel ? `Z${firstName}` : `Z${firstName.substring(1)}`;
} 

// sorteia um índice de imagem
function getPictureIndex() {
  const ZOMBIE_PICTURES_LENGTH = 20
  const ZOMBIE_FIRST_PICTURE_INDEX = 7

  return Math.floor((Math.random() * (ZOMBIE_PICTURES_LENGTH - ZOMBIE_FIRST_PICTURE_INDEX))) 
    + ZOMBIE_FIRST_PICTURE_INDEX;
}




export default router

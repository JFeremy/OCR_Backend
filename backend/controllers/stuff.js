const Thing = require('../models/Thing')
const fs = require('fs')

exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.thing)
  delete thingObject._id
  const thing = new Thing({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  console.log('Reception de la req')
  thing
    .save()
    .then(() => {
      console.log('Objet enregistré')
      res.status(201).json({ message: 'Object enregistré !' })
    })
    .catch((error) => {
      console.log('Objet Error', error)
      res.status(404).json({ error })
    })
}

exports.updateThing = (req, res, next) => {
  const thingObject = req.file
    ? {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`
    }
    : { ...req.body }
  Thing.updateOne(
    { _id: req.params.id },
    { ...thingObject, _id: req.params.id }
  )
    .then((thing) => res.status(200).json({ message: 'Objet Modifié' }))
    .catch((error) => res.status(400).json({ error }))
}

exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => {
      const filename = thing.imageUrl.split('/images/')[1]
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({ _id: req.params.id })
          .then((thing) => res.status(200).json({ message: 'Objet Supprimé' }))
          .catch((error) => res.status(400).json({ error }))
      })
    })
    .catch((error) => res.status(500).json({ error }))
}

exports.getThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }))
}

exports.getThings = (req, res, next) => {
  Thing.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }))
}

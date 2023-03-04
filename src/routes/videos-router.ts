import {Request, Response, Router} from 'express';
import {videosRepo} from '../repo/videos.-repo';

export const videosRouter = Router({})


type ErrorType = {
    'message': string
    'field': string
}
type ErrorsType = {
    'errorsMessages': ErrorType[]
}

videosRouter.get('/', (req: Request, res: Response) => {
    const result = videosRepo.findVideos()
    res.status(200).send(result)
})
videosRouter.get('/:id', (req: Request, res: Response) => {
    if (!req.params.id) {
        res.status(404)
    }
    const result = videosRepo.findVideo(+req.params.id)
    if (result) {
        res.status(200).send(result)
    } else {
        res.sendStatus(404)
    }
})

videosRouter.delete('/:id', (req: Request, res: Response) => {
    if (!req.params.id) {
        res.status(404)
    }
    let result = videosRepo.deleteVideo(+req.params.id);
    if (result) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
videosRouter.post('/', (req: Request, res: Response) => {
    const errors: ErrorsType = {
        'errorsMessages': []
    }
    if (!req.body.title || typeof req.body.title !== 'string' || req.body.title.trim().length > 40) {
        errors.errorsMessages.push({message: 'Title is required', field: 'title'})
    }
    if (!req.body.author || typeof req.body.author !== 'string' || req.body.author.trim().length > 40) {
        errors.errorsMessages.push({message: 'Author is required', field: 'author'})
    }
    if (!req.body.availableResolutions || !req.body.availableResolutions.length) {
        errors.errorsMessages.push({
            message: 'Resolution is required',
            field: 'availableResolutions'
        })
        res.status(400).send(errors)
    } else {
        const result = videosRepo.createVideo(req.body.title, req.body.author, req.body.availableResolutions)
        res.status(201).send(result)
    }
})
videosRouter.put('/:id', (req: Request, res: Response) => {
    if (!req.params.id) {
        res.status(404)
    }
    const valuesToUpdate = req.body
    const errors: ErrorsType = {
        'errorsMessages': []
    }
    if (!valuesToUpdate.title || !valuesToUpdate.author || !valuesToUpdate.availableResolutions || !valuesToUpdate.minAgeRestriction || !valuesToUpdate.publicationDate) {
        if (!valuesToUpdate.title || typeof valuesToUpdate.title !== 'string' || valuesToUpdate.title.trim().length > 40) {
            errors.errorsMessages.push({message: 'Title is required', field: 'title'})
        }
        if (!valuesToUpdate.author || typeof valuesToUpdate.author !== 'string' || valuesToUpdate.author.trim().length > 40) {
            errors.errorsMessages.push({message: 'Author is required', field: 'author'})
        }
        if (!valuesToUpdate.availableResolutions || !valuesToUpdate.availableResolutions.length) {
            errors.errorsMessages.push({
                message: 'AvailableResolutions is required',
                field: 'availableResolutions'
            })
        }
        if (!(valuesToUpdate.minAgeRestriction >= 1) || !(valuesToUpdate.minAgeRestriction <= 18)) {
            errors.errorsMessages.push({
                message: 'minAgeRestriction is required',
                field: 'minAgeRestriction'
            })
        }
        if (!valuesToUpdate.publicationDate || typeof valuesToUpdate.publicationDate !== 'string') {
            errors.errorsMessages.push({
                message: 'publicationDate is required',
                field: 'publicationDate'
            })
        }
        if (!valuesToUpdate.canBeDownloaded || typeof valuesToUpdate.publicationDate !== 'boolean' || null) {
            errors.errorsMessages.push({
                message: 'canBeDownloaded is required',
                field: 'canBeDownloaded'
            })
        }
        res.status(400).send(errors)
    }
    const result = videosRepo.updateVideo(+req.params.id, valuesToUpdate)
    if (result) {
        res.status(204)
    } else {
        res.sendStatus(404)
    }
})

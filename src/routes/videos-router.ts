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
    if (!req.body.title) {
        errors.errorsMessages.push({message: 'Title is required', field: 'title'})
    }
    if (!req.body.author) {
        errors.errorsMessages.push({message: 'Author is required', field: 'author'})
    }
    if (!req.body.availableResolutions) {
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
        if (!valuesToUpdate.title) {
            errors.errorsMessages.push({message: 'Title is required', field: 'title'})
        }
        if (!valuesToUpdate.author) {
            errors.errorsMessages.push({message: 'Author is required', field: 'author'})
        }
        if (!valuesToUpdate.availableResolutions) {
            errors.errorsMessages.push({
                message: 'AvailableResolutions is required',
                field: 'availableResolutions'
            })
        }
        if (!valuesToUpdate.minAgeRestriction) {
            errors.errorsMessages.push({
                message: 'minAgeRestriction is required',
                field: 'minAgeRestriction'
            })
        }
        if (!valuesToUpdate.publicationDate) {
            errors.errorsMessages.push({
                message: 'publicationDate is required',
                field: 'publicationDate'
            })
        }
        res.status(400).send(errors)
    }
    const result = videosRepo.updateVideo(+req.params.id, valuesToUpdate)
    if (result) {
        res.status(204)
    } else {
        res.sendStatus(400)
    }
})

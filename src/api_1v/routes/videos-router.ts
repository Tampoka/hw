import {Request, Response, Router} from 'express';
import {Resolutions, videosRepo} from '../repo/videos.-repo';
import {CodeResponsesEnum} from '../../enums';

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
    res.status(CodeResponsesEnum.OK_200).send(result)
})
videosRouter.get('/:id', (req: Request, res: Response) => {
    if (!req.params.id) {
        res.status(CodeResponsesEnum.Not_found_404)
    }
    const result = videosRepo.findVideo(+req.params.id)
    if (result) {
        res.status(CodeResponsesEnum.OK_200).send(result)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})

videosRouter.delete('/:id', (req: Request, res: Response) => {
    if (!req.params.id) {
        res.status(CodeResponsesEnum.Not_found_404)
    }
    let result = videosRepo.deleteVideo(+req.params.id);
    if (result) {
        res.sendStatus(CodeResponsesEnum.No_content_204)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})
videosRouter.post('/', (req: Request, res: Response) => {
    const errors: ErrorsType = {
        'errorsMessages': []
    }
    if (!req.body.title) {
        errors.errorsMessages.push({message: 'Title is required', field: 'title'})
    }
    if (req.body.title && typeof req.body.title !== 'string') {
        errors.errorsMessages.push({message: 'Title is not a string', field: 'title'})
    }
    if (req.body.title && req.body.title.length > 40) {
        errors.errorsMessages.push({message: 'Title length is invalid', field: 'title'})
    }
    if (!req.body.author) {
        errors.errorsMessages.push({message: 'Author is required', field: 'author'})
    }
    if (req.body.author && typeof req.body.author !== 'string') {
        errors.errorsMessages.push({message: 'Author is not a string', field: 'author'})
    }
    if (req.body.author && req.body.author.length > 20) {
        errors.errorsMessages.push({message: 'Author length is invalid', field: 'author'})
    }
    if (req.body.availableResolutions && !req.body.availableResolutions.length) {
        errors.errorsMessages.push({
            message: 'Resolution is empty',
            field: 'availableResolutions'
        })
    }
    if (req.body.availableResolutions && req.body.availableResolutions.some((el: string) => Resolutions.indexOf(el) === -1)) {
        errors.errorsMessages.push({
            message: 'Resolution type is invalid',
            field: 'availableResolutions'
        })
    }
    if (errors.errorsMessages.length) {
        res.status(CodeResponsesEnum.Incorrect_values_400).send(errors)
    } else {
        const result = videosRepo.createVideo(req.body.title, req.body.author, req.body.availableResolutions)
        res.status(CodeResponsesEnum.Created_201).send(result)
    }
})
videosRouter.put('/:id', (req: Request, res: Response) => {
    if (!req.params.id) {
        res.status(CodeResponsesEnum.Not_found_404)
    }
    const valuesToUpdate = req.body
    const errors: ErrorsType = {
        'errorsMessages': []
    }
    if (!valuesToUpdate.title || typeof valuesToUpdate.title !== 'string' || valuesToUpdate.title.length > 40) {
        errors.errorsMessages.push({message: 'Title is required', field: 'title'})
    }
    if (!valuesToUpdate.author || typeof valuesToUpdate.author !== 'string' || valuesToUpdate.author.length > 20) {
        errors.errorsMessages.push({message: 'Author is required', field: 'author'})
    }
    if (req.body.availableResolutions && !req.body.availableResolutions.length) {
        errors.errorsMessages.push({
            message: 'Resolution is empty',
            field: 'availableResolutions'
        })
    }
    if (req.body.availableResolutions && req.body.availableResolutions.some((el: string) => Resolutions.indexOf(el) === -1)) {
        errors.errorsMessages.push({
            message: 'Resolution type is invalid',
            field: 'availableResolutions'
        })
    }
    if (valuesToUpdate.minAgeRestriction && valuesToUpdate.minAgeRestriction < 1) {
        errors.errorsMessages.push({
            message: 'minAgeRestriction is required',
            field: 'minAgeRestriction'
        })
    }
    if (valuesToUpdate.minAgeRestriction && valuesToUpdate.minAgeRestriction > 18) {
        errors.errorsMessages.push({
            message: 'minAgeRestriction is required',
            field: 'minAgeRestriction'
        })
    }
    if (valuesToUpdate.publicationDate && typeof valuesToUpdate.publicationDate !== 'string') {
        errors.errorsMessages.push({
            message: 'publicationDate is required',
            field: 'publicationDate'
        })
    }
    if (valuesToUpdate.canBeDownloaded && typeof valuesToUpdate.canBeDownloaded != 'boolean' || null) {
        errors.errorsMessages.push({
            message: 'canBeDownloaded is required',
            field: 'canBeDownloaded'
        })
    }
    if (errors.errorsMessages.length) {
        res.status(CodeResponsesEnum.Incorrect_values_400).send(errors)
    } else {
        const result = videosRepo.updateVideo(+req.params.id, valuesToUpdate)
        if (result) {
            res.sendStatus(CodeResponsesEnum.No_content_204)
        } else {
            res.sendStatus(CodeResponsesEnum.Not_found_404)
        }
    }
})

export type VideoType = {
    "id": number
    "title": string
    "author": string
    "canBeDownloaded": boolean
    "minAgeRestriction": number | null
    "createdAt": string
    "publicationDate": string
    "availableResolutions": ResolutionsType
}
export type VideoUpdateType = {
    "title": string
    "author": string
    "minAgeRestriction": number | null
    "publicationDate": string
    "availableResolutions": ResolutionsType
}
const Resolutions = [
    '144',
    "240",
    "360",
    "480",
    "720",
    "1080",
    "1440",
    "1080",
] as const

type ResolutionsType = Array<typeof Resolutions[number]>

let videosData: VideoType[] | null = [{
    id: 1,
    title: 'Cooking',
    author: 'Dimych',
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: '12.03.1988',
    publicationDate: '12.03.1988',
    availableResolutions: ['144', '240']
},
    {
        id: 2,
        title: 'Exercise',
        author: 'me',
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: '12.03.2017',
        publicationDate: '12.03.2018',
        availableResolutions: ['240']
    }]

export const videosRepo = {
    findVideos() {
        return videosData
    },
    findVideo(id: number) {
        return videosData!.find(el => el.id === id)
    },
    createVideo(title: string, author: string, resolution: ResolutionsType) {
        const newVideo = {
            id: Date.now(),
            title,
            author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolutions: resolution
        }
        if (videosData) {
            videosData!.push(newVideo)
        }
        return newVideo
    },
    updateVideo(id: number, valuesToUpdate: VideoUpdateType) {
        const video = videosData!.find(el => el.id === id)
        if (video) {
            video.title = valuesToUpdate.title
            video.author = valuesToUpdate.author
            video.availableResolutions = valuesToUpdate.availableResolutions
            video.minAgeRestriction = valuesToUpdate.minAgeRestriction
            video.publicationDate = valuesToUpdate.publicationDate
            return video
        } else {
            return false
        }
    },
    deleteVideo(id: number) {
        let index = videosData!.findIndex(el => el.id === id)
        if (index > -1) {
            videosData!.splice(index, 1)
            return true
        } else {
            return false
        }
    },
    deleteAll() {
        videosData = [] as VideoType[]
    }
}
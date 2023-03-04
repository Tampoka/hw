export type VideoType = {
    "id": number
    "title": string
    "author": string
    "canBeDownloaded": boolean
    "minAgeRestriction": number | null
    "createdAt": string
    "publicationDate": string
    "availableResolutions": string[]
}
export type VideoUpdateType = {
    "title": string
    "author": string
    "minAgeRestriction": number | null
    "publicationDate": string
    "availableResolutions": string[]
    "canBeDownloaded": boolean | null
}
export const Resolutions = [
    '144',
    "240",
    "360",
    "480",
    "720",
    "1080",
    "1440",
    "1080",
]

let videosData: VideoType[] = [{
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
    createVideo(title: string, author: string, resolution: string[]) {
        const newVideo: VideoType = {
            id: +(new Date()),
            title,
            author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
            publicationDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
            availableResolutions: resolution
        }
        videosData.push(newVideo)
        return newVideo
    },
    updateVideo(id: number, valuesToUpdate: VideoUpdateType) {
        const video = videosData!.find(el => el.id === id)
        if (video) {
            video.title = valuesToUpdate.title || video.title
            video.author = valuesToUpdate.author || video.author
            video.availableResolutions = valuesToUpdate.availableResolutions || video.availableResolutions
            video.minAgeRestriction = valuesToUpdate.minAgeRestriction || null
            video.publicationDate = valuesToUpdate.publicationDate || video.publicationDate
            video.canBeDownloaded = valuesToUpdate.canBeDownloaded || video.canBeDownloaded
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
        videosData = []
    }
}
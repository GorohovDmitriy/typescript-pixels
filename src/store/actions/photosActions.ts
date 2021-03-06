import {createClient, PhotosWithTotalResults, ErrorResponse, Photos} from 'pexels'
import {ThunkAction} from 'redux-thunk'

import {RootState} from '..'
import {PhotoActions, GET_PHOTOS, SET_ERROR} from '../types'

const client = createClient(process.env.REACT_APP_PEXELS_API || '')

export const getPhotos = (
	page: number,
	searchQuery: string,
	onSuccess: () => void,
	onError: () => void,
): ThunkAction<void, RootState, null, PhotoActions> => {
	return async (dispatch) => {
		try {
			const photos: PhotosWithTotalResults | ErrorResponse = await client.photos.search({
				page,
				query: searchQuery,
				per_page: 10,
			})
			if ('error' in photos) {
				throw new Error(photos.error)
			} else {
				dispatch({
					type: GET_PHOTOS,
					payload: {
						photos: photos.photos,
						page: page,
						total_results: photos.total_results,
					},
				})
				onSuccess()
			}
		} catch (error) {
			dispatch(setError(error))
			onError()
		}
	}
}

export const getCuratedPhotos = (
	page: number,
	onSuccess: () => void,
	onError: () => void,
): ThunkAction<void, RootState, null, PhotoActions> => {
	return async (dispatch) => {
		try {
			const photos: Photos | ErrorResponse = await client.photos.curated({page, per_page: 10})
			if ('error' in photos) {
				throw new Error(photos.error)
			} else {
				dispatch({
					type: GET_PHOTOS,
					payload: {
						photos: photos.photos,
						page: page,
						total_results: 0,
					},
				})
				onSuccess()
			}
		} catch (error) {
			dispatch(setError(error))
			onError()
		}
	}
}

export const setError = (error: any): PhotoActions => {
	return {
		type: SET_ERROR,
		payload: error,
	}
}

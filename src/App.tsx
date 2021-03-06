import React, { FC, useEffect, MouseEvent, Fragment, useState } from 'react'
import { Photo } from 'pexels'
import { useDispatch, useSelector } from 'react-redux'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import './App.css'

import { getPhotos, getCuratedPhotos, setError } from './store/actions/photosActions'
import { RootState } from './store'
import Intro from './components/Intro'
import { Modal } from './components/Modal'

const App: FC = () => {
	const dispatch = useDispatch()
	const { photos, total_results, error } = useSelector((state: RootState) => state.photos)
	const [mode, setMode] = useState('trending')
	const [loading, setLoading] = useState(true)
	const [searchFor, setSearchFor] = useState('')
	const [page, setPage] = useState(1)
	const [title, setTitle] = useState('Trending')
	const [btnLoading, setBtnLoading] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [src, setSrc] = useState('')
	const [autorName, setAutorName] = useState('')
	const [autorUrl, setAutorUrl] = useState('')

	useEffect(() => {
		dispatch(
			getCuratedPhotos(
				1,
				() => setLoading(false),
				() => setLoading(false),
			),
		)
	}, [dispatch])

	const searchPhotosHandler = (query: string) => {
		if (error) {
			setError('')
		}
		setMode('search')
		setLoading(true)
		setSearchFor(query)
		setPage(1)
		dispatch(
			getPhotos(
				1,
				query,
				() => setLoading(false),
				() => setLoading(false),
			),
		)
		setTitle(`Search results for '${query}'`)
	}

	const loadMoreHandler = () => {
		setBtnLoading(true)
		setPage((prev) => prev + 1)
		if (mode === 'trending') {
			dispatch(
				getCuratedPhotos(
					page + 1,
					() => setBtnLoading(false),
					() => setBtnLoading(false),
				),
			)
		} else {
			dispatch(
				getPhotos(
					page + 1,
					searchFor,
					() => setBtnLoading(false),
					() => setBtnLoading(false),
				),
			)
		}
	}

	const showTrandingPhoto = () => {
		setLoading(true)
		setTitle('Trending')
		setMode('trending')
		dispatch(
			getCuratedPhotos(
				1,
				() => setLoading(false),
				() => setLoading(false),
			),
		)
	}

	const modalCloseHandler = () => {
		setShowModal(false)
		setSrc('')
		setAutorName('')
		setAutorUrl('')
	}

	const imageClickHandler = (e: MouseEvent, photo: Photo) => {
		e.preventDefault()
		setSrc(photo.src.original)
		setAutorUrl(photo.photographer_url)
		setAutorName(photo.photographer)
		setShowModal(true)
	}

	let content = null

	if (content) {
		content = (
			<div className='is-flex is-justify-content-center py-6'>
				<div className='loading'></div>
			</div>
		)
	} else {
		content = error ? (
			<div className='notification is-danger mt-6 has-text-centered'>{error}</div>
		) : (
			<Fragment>
				{mode === 'search' ? (
					<div className='is-flex is-justify-content-center py-5'>
						<button className='button is-link' onClick={showTrandingPhoto}>
							Back to tranding
						</button>
					</div>
				) : null}
				<h2 className='is-size-1 has-text-centered py-6'>{title}</h2>
				{photos.length > 0 ? (
					<ResponsiveMasonry columnsCountBreakPoints={{ 480: 2, 900: 5 }}>
						<Masonry gutter={20}>
							{photos.map((photo) => (
								<div key={photo.id} className='masonry-item'>
									<a href='/#' onClick={(e) => { }}>
										<img src={photo.src.large} alt='' onClick={(e) => imageClickHandler(e, photo)} />
									</a>
								</div>
							))}
						</Masonry>
					</ResponsiveMasonry>
				) : (
					<p className='has-text-centered'>No results</p>
				)}

				<div className='is-flex is-justify-content-center py-6'>
					{(total_results > page * 10 || mode === 'trending') && (
						<button
							className='button is-primary is-large'
							onClick={loadMoreHandler}
							disabled={btnLoading}
						>
							{!btnLoading ? 'Load more' : <div className='loading loading--smal'></div>}
						</button>
					)}
				</div>
			</Fragment>
		)
	}

	return (
		<div>
			<Intro onSearch={searchPhotosHandler} />
			<div className='container px-4'>{content}</div>
			{showModal && (
				<Modal
					src={src}
					onClose={modalCloseHandler}
					autorName={autorName}
					autorUrl={autorUrl}
				/>
			)}
		</div>
	)
}

export default App

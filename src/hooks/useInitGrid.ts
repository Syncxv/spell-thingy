import { Letter } from '../types'
import { getValue } from '../utils/getValue'
import { useEffect, useState } from 'react'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const useInitGrid = (size = 5) => {
	const [grid, setGrid] = useState<Letter[][]>([])
	useEffect(() => {
		let tempGrid: Letter[][] = []
		for (let row = 0; row < size; row++) {
			tempGrid[row] = []
			for (let col = 0; col < size; col++) {
				const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)]
				tempGrid[row][col] = { key: randomLetter, value: getValue(randomLetter), row, column: col }
			}
		}

		setGrid(tempGrid)
	}, [])

	return grid
}

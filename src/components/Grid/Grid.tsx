import { useInitGrid } from '../../hooks/useInitGrid'
export const Grid: React.FC<{}> = () => {
	const size = 5
	const grid = useInitGrid(size)
	console.log(grid)
	return (
		<>
			<div
				style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
				className="grid-wrapper grid gap-x-2 gap-y-8"
			>
				{grid != null &&
					grid.flat().map((cell, i) => (
						<div key={i} className="text-center">
							{cell.key}
						</div>
					))}
			</div>
		</>
	)
}

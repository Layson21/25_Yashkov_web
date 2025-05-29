import { useState } from 'react'
import TextBlock from "../blocks/TextBlock"
import "../assets/css/index.css"
import SiteConstructor from '../Constructor'

function Board() {
	const [isEditable, setEditable] = useState(false)
	const [blocks, setBlocks] = useState([]);

	return (
		<>
			<SiteConstructor isEditable={isEditable} setEditable={setEditable}/>
		</>
	)
}

export default Board
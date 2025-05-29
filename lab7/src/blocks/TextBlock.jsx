import { useState, useEffect } from 'react'

function TextBlock() {
	const [cursor, setCursor] = useState("grab");
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [dragging, setDragging] = useState(false);

	useEffect(() => {
		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2; 
		setPosition({ x: centerX, y: centerY });
	}, []);

	const handleMouseDown = (e) => {
	    if (e.button !== 0) return; // только левая кнопка
		setDragging(true);
		setCursor('grabbing');
		setOffset({
			x: e.clientX - position.x,
			y: e.clientY - position.y,
		});
	};

	const handleMouseMove = (e) => {
		if (!dragging) return;
		setPosition({
			x: e.clientX - offset.x,
			y: e.clientY - offset.y,
		});
	};

	const handleMouseUp = () => {
		setDragging(false);
		setCursor('grab');
	};


	return (
		<>
			<div onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} className="block" style={{left: position.x, top: position.y}}>
				<img className="paper untouchable" src="img/paper.png"/>
				<textarea className="text-area" />
				<button className="save-button">Сохранить</button>
			</div>
		</>
	)
}

export default TextBlock